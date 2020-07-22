import * as path from "path";
import { namedTypes, builders, visit } from "ast-types";
import { print } from "recast";
import {
  OperationObject,
  OpenAPIObject,
  SchemaObject,
  ParameterObject,
} from "openapi3-ts";
import { camelCase } from "camel-case";
import { readCode, Module, relativeImportPath } from "../../util/module";
import {
  parse,
  interpolateAST,
  getTopLevelConstants,
  getImportDeclarations,
  consolidateImports,
} from "../../util/ast";
import {
  removeSchemaPrefix,
  getRequestBodySchemaRef,
  JSON_MIME,
  STATUS_CREATED,
  HTTPMethod,
  getOperations,
  getResponseContentSchemaRef,
  STATUS_OK,
  resolveRef,
} from "../../util/open-api";

/**
 * @todo dynamically create DTOs in tests
 * @todo move most logic to utilities
 */

const testTemplatePath = require.resolve("./templates/test.ts");
const createTemplatePath = require.resolve("./templates/create.ts");
const findManyTemplatePath = require.resolve("./templates/find-many.ts");
const findOneTemplatePath = require.resolve("./templates/find-one.ts");

export default async function createTestModule(
  api: OpenAPIObject,
  entity: string,
  entityType: string
): Promise<Module> {
  const modulePath = path.join(entity, `${entity}.test.ts`);
  const template = await readCode(testTemplatePath);
  const imports: namedTypes.ImportDeclaration[] = [];
  const serviceProperties: namedTypes.ObjectExpression["properties"] = [];
  const tests: namedTypes.CallExpression[] = [];
  const constants: namedTypes.VariableDeclarator[] = [];
  const operations = getOperations(api);
  const moduleASTs: namedTypes.File[] = await Promise.all(
    operations.map(({ path, httpMethod, operation }) => {
      switch (httpMethod) {
        case HTTPMethod.post: {
          return createCreate(path, operation, entityType);
        }
        case HTTPMethod.get: {
          const responseContentSchemaRef = getResponseContentSchemaRef(
            operation,
            STATUS_OK,
            JSON_MIME
          );
          const responseContentSchema = resolveRef(
            api,
            responseContentSchemaRef
          ) as SchemaObject;
          const responseContent = removeSchemaPrefix(responseContentSchemaRef);
          switch (responseContentSchema.type) {
            case "array": {
              return createFindMany(path, responseContent);
            }
            case "object": {
              return createFindOne(path, operation, responseContent);
            }
          }
        }
      }
      throw new Error("Unknown operation");
    })
  );
  for (const moduleAst of moduleASTs) {
    removeTSVariableDeclares(moduleAst);
    const moduleConstants = getTopLevelConstants(moduleAst);
    const serviceConstant = findServiceConstant(moduleConstants);
    serviceProperties.push(...serviceConstant.init.properties);
    const restConstants = moduleConstants.filter(
      (constant) => constant !== serviceConstant
    );
    const moduleTests = findTests(moduleAst);
    tests.push(...moduleTests);
    constants.push(...restConstants);
    imports.push(...getImportDeclarations(moduleAst));
  }
  const ast = parse(template) as namedTypes.File;
  const moduleId = builders.identifier(`${entityType}Module`);
  const serviceId = builders.identifier(`${entityType}Service`);

  interpolateAST(ast, {
    TEST_NAME: builders.stringLiteral(entityType),
    MODULE: moduleId,
    SERVICE: serviceId,
  });

  const visitor = findValidatorConstant(ast);

  const describe = findDescribe(ast);

  const [, describeFn] = describe.expression.arguments as [
    namedTypes.Identifier,
    namedTypes.FunctionExpression
  ];

  describeFn.body.body.push(...tests.map(builders.expressionStatement));

  const allImports = [
    ...getImportDeclarations(ast),
    ...imports,
    builders.importDeclaration(
      [builders.importSpecifier(moduleId)],
      builders.stringLiteral(
        relativeImportPath(modulePath, `${entity}/${entity}.module.ts`)
      )
    ),
    builders.importDeclaration(
      [builders.importSpecifier(serviceId)],
      builders.stringLiteral(
        relativeImportPath(modulePath, `${entity}/${entity}.service.ts`)
      )
    ),
  ];

  const nextAst = builders.program([
    ...consolidateImports(allImports),
    visitor,
    ...constants.map((constant) =>
      builders.variableDeclaration("const", [constant])
    ),
    builders.variableDeclaration("const", [
      builders.variableDeclarator(
        builders.identifier("service"),
        builders.objectExpression(serviceProperties)
      ),
    ]),
    describe,
  ]);

  return {
    path: modulePath,
    code: print(nextAst).code,
  };
}

async function createCreate(
  pathname: string,
  operation: OperationObject,
  entityType: string
): Promise<namedTypes.File> {
  const template = await readCode(createTemplatePath);
  const ast = parse(template) as namedTypes.File;
  const bodyType = removeSchemaPrefix(
    getRequestBodySchemaRef(operation, JSON_MIME)
  );
  const bodyTypeInstance = camelCase(bodyType);
  interpolateAST(ast, {
    PATHNAME: builders.stringLiteral(pathname),
    /** @todo use operation */
    STATUS_CODE: builders.numericLiteral(Number(STATUS_CREATED)),
    BODY_TYPE: builders.identifier(bodyType),
    BODY_TYPE_INSTANCE: builders.identifier(bodyTypeInstance),
    ENTITY: builders.identifier(entityType),
    CREATED_ENTITY: builders.identifier(`created${entityType}`),
  });
  return ast;
}

async function createFindMany(
  pathname: string,
  responseContent: string
): Promise<namedTypes.File> {
  const template = await readCode(findManyTemplatePath);
  const ast = parse(template) as namedTypes.File;
  interpolateAST(ast, {
    PATHNAME: builders.stringLiteral(pathname),
    STATUS: builders.numericLiteral(Number(STATUS_OK)),
    CONTENT: builders.identifier(responseContent),
    CONTENT_INSTANCE: builders.identifier(camelCase(responseContent)),
  });
  return ast;
}

async function createFindOne(
  pathname: string,
  operation: OperationObject,
  responseContent: string
): Promise<namedTypes.File> {
  const template = await readCode(findOneTemplatePath);
  const ast = parse(template) as namedTypes.File;
  /** @todo support deep */
  const [, resource] = pathname.split("/");
  if (!operation.parameters) {
    throw new Error("Operation must have parameters defined");
  }
  const parameter = operation.parameters.find(
    (parameter) =>
      "in" in parameter && parameter.in === "path" && !("$ref" in parameter)
  ) as ParameterObject;
  interpolateAST(ast, {
    PATHNAME: builders.stringLiteral(pathname),
    STATUS: builders.numericLiteral(Number(STATUS_OK)),
    CONTENT: builders.identifier(responseContent),
    CONTENT_INSTANCE: builders.identifier(camelCase(responseContent)),
    RESOURCE: builders.stringLiteral(resource),
    PARAM: builders.stringLiteral(parameter.name),
  });
  return ast;
}

type ObjectExpressionVariableDeclarator = namedTypes.VariableDeclarator & {
  init: { type: "ObjectExpression" };
};

function findServiceConstant(
  constants: namedTypes.VariableDeclarator[]
): ObjectExpressionVariableDeclarator {
  const serviceConstant = constants.find(
    (constant) => "name" in constant.id && constant.id.name === "service"
  );
  if (!serviceConstant) {
    throw new Error("Service constant must be defined");
  }
  if (serviceConstant?.init?.type !== "ObjectExpression") {
    throw new Error("Service constant must be an object expression");
  }
  return serviceConstant as ObjectExpressionVariableDeclarator;
}

function findTests(ast: namedTypes.File): namedTypes.CallExpression[] {
  const tests = [];
  for (const statement of ast.program.body) {
    if (
      statement.type === "ExpressionStatement" &&
      statement.expression.type === "CallExpression" &&
      statement.expression.callee.type === "Identifier" &&
      statement.expression.callee.name === "test"
    ) {
      tests.push(statement.expression);
    }
  }
  return tests;
}

type CallExpressionStatement = namedTypes.ExpressionStatement & {
  expression: namedTypes.CallExpression;
};

function findDescribe(ast: namedTypes.File): CallExpressionStatement {
  const statement = ast.program.body.find(
    (statement) =>
      statement.type === "ExpressionStatement" &&
      statement.expression.type === "CallExpression" &&
      statement.expression.callee.type === "Identifier" &&
      statement.expression.callee.name === "describe"
  ) as CallExpressionStatement;
  if (!statement) {
    throw new Error(
      "Could not find call of describe() at the top level of the file"
    );
  }
  return statement;
}

function findValidatorConstant(
  ast: namedTypes.File
): namedTypes.VariableDeclaration {
  const statement = ast.program.body.find(
    (statement) =>
      statement.type === "VariableDeclaration" &&
      statement.declarations.length === 1 &&
      statement.declarations[0].type === "VariableDeclarator" &&
      statement.declarations[0].id.type === "Identifier" &&
      statement.declarations[0].id.name === "validator"
  ) as namedTypes.VariableDeclaration;
  if (!statement) {
    throw new Error(
      "Could not find a constant validator at the top level of the file"
    );
  }
  return statement;
}

function removeTSVariableDeclares(ast: namedTypes.File) {
  visit(ast, {
    visitVariableDeclaration(path) {
      if (path.get("declare").value) {
        path.prune();
      }
      this.traverse(path);
    },
  });
}
