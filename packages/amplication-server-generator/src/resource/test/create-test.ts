import * as path from "path";
import { namedTypes, builders } from "ast-types";
import { print } from "recast";
import {
  OperationObject,
  OpenAPIObject,
  SchemaObject,
  ParameterObject,
  PathsObject,
} from "openapi3-ts";
import { camelCase } from "camel-case";
import { readCode, Module, relativeImportPath } from "../../util/module";
import {
  parse,
  interpolateAST,
  getTopLevelConstants,
  getImportDeclarations,
  consolidateImports,
  removeTSVariableDeclares,
  findCallExpressionByCalleeId,
  findVariableDeclaratorById,
  findCallExpressionsByCalleeId,
  matchIdentifier,
  singleConstantDeclaration,
  findVariableDeclarationById,
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
import { createTestData } from "../../util/open-api-code-generation";

const testTemplatePath = require.resolve("./templates/test.ts");
const createTemplatePath = require.resolve("./templates/create.ts");
const findManyTemplatePath = require.resolve("./templates/find-many.ts");
const findOneTemplatePath = require.resolve("./templates/find-one.ts");

export default async function createTestModule(
  api: OpenAPIObject,
  paths: PathsObject,
  entity: string,
  entityType: string,
  entityServiceModule: string,
  entityModule: string
): Promise<Module> {
  const modulePath = path.join(entity, `${entity}.test.ts`);
  const template = await readCode(testTemplatePath);
  const imports: namedTypes.ImportDeclaration[] = [];
  const serviceProperties: namedTypes.ObjectExpression["properties"] = [];
  const tests: namedTypes.CallExpression[] = [];
  const constants: namedTypes.VariableDeclarator[] = [];
  const operations = getOperations(paths);
  const moduleASTs: namedTypes.File[] = await Promise.all(
    operations.map(({ path, httpMethod, operation }) => {
      switch (httpMethod) {
        case HTTPMethod.post: {
          return createCreate(api, path, operation);
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
          const responseContentId = removeSchemaPrefix(
            responseContentSchemaRef
          );
          switch (responseContentSchema.type) {
            case "array": {
              return createFindMany(
                api,
                path,
                responseContentId,
                responseContentSchema
              );
            }
            case "object": {
              return createFindOne(
                api,
                path,
                operation,
                responseContentId,
                responseContentSchema
              );
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
    const serviceObject = findServiceObject(moduleAst);

    serviceProperties.push(...serviceObject.properties);
    const restConstants = moduleConstants.filter(
      (constant) => !matchIdentifier(constant.id, "service")
    );
    const moduleTests = findCallExpressionsByCalleeId(moduleAst, "test");

    if (moduleTests.length === 0) {
      throw new Error("Expected to find at least one call to test() in file");
    }

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

  const validator = findVariableDeclarationById(ast, "validator");

  if (!validator) {
    throw new Error("No variable with the ID validator was found");
  }

  const describe = findCallExpressionByCalleeId(ast, "describe");

  if (!describe) {
    throw new Error("No call to describe() was found");
  }

  const [, describeFn] = describe.arguments as [
    namedTypes.Identifier,
    namedTypes.FunctionExpression
  ];

  describeFn.body.body.push(...tests.map(builders.expressionStatement));

  const allImports = [
    ...getImportDeclarations(ast),
    ...imports,
    builders.importDeclaration(
      [builders.importSpecifier(moduleId)],
      builders.stringLiteral(relativeImportPath(modulePath, entityModule))
    ),
    builders.importDeclaration(
      [builders.importSpecifier(serviceId)],
      builders.stringLiteral(
        relativeImportPath(modulePath, entityServiceModule)
      )
    ),
  ];

  const nextAst = builders.program([
    ...consolidateImports(allImports),
    validator,
    ...constants.map(singleConstantDeclaration),
    singleConstantDeclaration(
      builders.variableDeclarator(
        builders.identifier("service"),
        builders.objectExpression(serviceProperties)
      )
    ),
    builders.expressionStatement(describe),
  ]);

  return {
    path: modulePath,
    code: print(nextAst).code,
  };
}

async function createCreate(
  api: OpenAPIObject,
  pathname: string,
  operation: OperationObject
): Promise<namedTypes.File> {
  const template = await readCode(createTemplatePath);
  const ast = parse(template) as namedTypes.File;
  const bodyTypeRef = getRequestBodySchemaRef(operation, JSON_MIME);
  const bodyType = removeSchemaPrefix(bodyTypeRef);
  const bodyTypeSchema = resolveRef(api, bodyTypeRef);
  const bodyId = camelCase(bodyType);
  const responseContentSchemaRef = getResponseContentSchemaRef(
    operation,
    STATUS_CREATED,
    JSON_MIME
  );
  const responseContentSchema = resolveRef(
    api,
    responseContentSchemaRef
  ) as SchemaObject;
  const responseContentId = removeSchemaPrefix(responseContentSchemaRef);
  interpolateAST(ast, {
    PATHNAME: builders.stringLiteral(pathname),
    /** @todo use operation */
    STATUS_CODE: builders.numericLiteral(Number(STATUS_CREATED)),
    BODY_TYPE: builders.identifier(bodyType),
    BODY_ID: builders.identifier(bodyId),
    BODY: createTestData(api, bodyTypeSchema),
    CONTENT: createTestData(api, responseContentSchema),
    CONTENT_TYPE: builders.identifier(responseContentId),
    CONTENT_ID: builders.identifier("created" + responseContentId),
  });
  return ast;
}

async function createFindMany(
  api: OpenAPIObject,
  pathname: string,
  responseContentId: string,
  responseContentSchema: SchemaObject
): Promise<namedTypes.File> {
  const template = await readCode(findManyTemplatePath);
  const ast = parse(template) as namedTypes.File;
  interpolateAST(ast, {
    PATHNAME: builders.stringLiteral(pathname),
    STATUS: builders.numericLiteral(Number(STATUS_OK)),
    CONTENT_TYPE: builders.identifier(responseContentId),
    CONTENT_ID: builders.identifier(responseContentId),
    CONTENT: createTestData(api, responseContentSchema),
  });
  return ast;
}

async function createFindOne(
  api: OpenAPIObject,
  pathname: string,
  operation: OperationObject,
  responseContentId: string,
  responseContentSchema: SchemaObject
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
  if (!parameter.schema) {
    throw new Error("Paramter schema must be defined");
  }
  interpolateAST(ast, {
    PATHNAME: builders.stringLiteral(pathname),
    STATUS: builders.numericLiteral(Number(STATUS_OK)),
    CONTENT_TYPE: builders.identifier(responseContentId),
    CONTENT_ID: builders.identifier(camelCase(responseContentId)),
    CONTENT: createTestData(api, responseContentSchema),
    RESOURCE: builders.stringLiteral(resource),
    PARAM: builders.stringLiteral(parameter.name),
    EXISTING_PARAM: builders.identifier(
      camelCase(["existing", parameter.name].join(" "))
    ),
    NON_EXISTING_PARAM: builders.identifier(
      camelCase(["nonExisting", parameter.name].join(" "))
    ),
    EXISTING_PARAM_VALUE: createTestData(
      api,
      parameter.schema,
      "existing param"
    ),
    NON_EXISTING_PARAM_VALUE: createTestData(
      api,
      parameter.schema,
      "non existing param"
    ),
  });
  return ast;
}

/**
 * Find the service object definition in given test module AST
 * @param ast the test module AST representation
 */
function findServiceObject(ast: namedTypes.File): namedTypes.ObjectExpression {
  const variable = findVariableDeclaratorById(ast, "service");
  if (!variable) {
    throw new Error("No variable named service was found in file");
  }
  if (variable?.init?.type !== "ObjectExpression") {
    throw new Error("The service variable must be initialized with an object");
  }
  return variable.init;
}
