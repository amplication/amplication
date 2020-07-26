import * as path from "path";
import { namedTypes, builders } from "ast-types";
import { print } from "recast";
import {
  OperationObject,
  OpenAPIObject,
  SchemaObject,
  PathsObject,
} from "openapi3-ts";
import { camelCase } from "camel-case";
import { pascalCase } from "pascal-case";
import { readFile, Module, relativeImportPath } from "../../util/module";
import {
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
  importNames,
  getInstanceId,
  jsonToExpression,
} from "../../util/ast";
import {
  getRequestBodySchemaRef,
  JSON_MIME,
  STATUS_CREATED,
  HTTPMethod,
  getOperations,
  getResponseContentSchemaRef,
  STATUS_OK,
  resolveRef,
  getParameters,
  resolveObject,
} from "../../util/open-api";
import { schemaToType } from "../../util/open-api-code-generation";

const testTemplatePath = require.resolve("./templates/test.ts");
const createTemplatePath = require.resolve("./templates/create.ts");
const findManyTemplatePath = require.resolve("./templates/find-many.ts");
const findOneTemplatePath = require.resolve("./templates/find-one.ts");

export default async function createTestModule(
  api: OpenAPIObject,
  paths: PathsObject,
  resource: string,
  entity: string,
  entityType: string,
  entityServiceModule: string,
  entityModule: string
): Promise<Module> {
  const modulePath = path.join(entity, `${entity}.test.ts`);
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
          /** @todo get status code from operation */
          const responseContentSchemaRef = getResponseContentSchemaRef(
            operation,
            STATUS_OK,
            JSON_MIME
          );
          const responseContentSchema = resolveRef(
            api,
            responseContentSchemaRef
          ) as SchemaObject;
          switch (responseContentSchema.type) {
            case "array": {
              return createFindMany(
                api,
                path,
                responseContentSchemaRef,
                responseContentSchema
              );
            }
            case "object": {
              return createFindOne(
                api,
                resource,
                path,
                operation,
                responseContentSchemaRef,
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
  const file = await readFile(testTemplatePath);
  const moduleId = builders.identifier(`${entityType}Module`);
  const serviceId = builders.identifier(`${entityType}Service`);

  interpolateAST(file, {
    TEST_NAME: builders.stringLiteral(entityType),
    MODULE: moduleId,
    SERVICE: serviceId,
  });

  const validator = findVariableDeclarationById(file, "validator");

  if (!validator) {
    throw new Error("No variable with the ID validator was found");
  }

  const describe = findCallExpressionByCalleeId(file, "describe");

  if (!describe) {
    throw new Error("No call to describe() was found");
  }

  const [, describeFn] = describe.arguments as [
    namedTypes.Identifier,
    namedTypes.FunctionExpression
  ];

  describeFn.body.body.push(...tests.map(builders.expressionStatement));

  const allImports = [
    ...getImportDeclarations(file),
    ...imports,
    importNames([moduleId], relativeImportPath(modulePath, entityModule)),
    importNames(
      [serviceId],
      relativeImportPath(modulePath, entityServiceModule)
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
  const file = await readFile(createTemplatePath);
  const bodyTypeRef = getRequestBodySchemaRef(operation, JSON_MIME);
  const bodyType = schemaToType({ $ref: bodyTypeRef });
  const bodyTypeSchema = resolveRef(api, bodyTypeRef) as SchemaObject;
  const bodyId = getInstanceId(bodyType.type);
  /** @todo get status code from operation */
  const responseContentSchemaRef = getResponseContentSchemaRef(
    operation,
    STATUS_CREATED,
    JSON_MIME
  );
  const responseContentSchema = resolveRef(
    api,
    responseContentSchemaRef
  ) as SchemaObject;
  const content = schemaToType({ $ref: responseContentSchemaRef });
  const responseContentId = getInstanceId(content.type);

  interpolateAST(file, {
    PATHNAME: builders.stringLiteral(pathname),
    /** @todo get status code from operation */
    STATUS_CODE: builders.numericLiteral(Number(STATUS_CREATED)),
    BODY_TYPE: bodyType.type,
    BODY_ID: bodyId,
    BODY: jsonToExpression(bodyTypeSchema.example),
    CONTENT: jsonToExpression(responseContentSchema.example),
    CONTENT_TYPE: content.type,
    CONTENT_ID: builders.identifier(
      "created" + pascalCase(responseContentId.name)
    ),
  });

  file.program.body.unshift(...bodyType.imports);

  return file;
}

async function createFindMany(
  api: OpenAPIObject,
  pathname: string,
  responseContentRef: string,
  responseContentSchema: SchemaObject
): Promise<namedTypes.File> {
  const file = await readFile(findManyTemplatePath);
  const content = schemaToType({ $ref: responseContentRef });
  interpolateAST(file, {
    PATHNAME: builders.stringLiteral(pathname),
    /** @todo get status code from operation */
    STATUS: builders.numericLiteral(Number(STATUS_OK)),
    CONTENT_TYPE: content.type,
    CONTENT_ID: getInstanceId(content.type),
    CONTENT: jsonToExpression(responseContentSchema.example),
  });
  return file;
}

async function createFindOne(
  api: OpenAPIObject,
  resource: string,
  pathname: string,
  operation: OperationObject,
  responseContentRef: string,
  responseContentSchema: SchemaObject
): Promise<namedTypes.File> {
  const file = await readFile(findOneTemplatePath);
  const content = schemaToType({ $ref: responseContentRef });
  const parameters = getParameters(api, operation);
  const parameter = parameters.find((parameter) => parameter.in === "path");
  if (!parameter) {
    throw new Error("Find one operation must have a path parameter");
  }
  if (!parameter.schema) {
    throw new Error("Paramter schema must be defined");
  }
  if (!parameter.examples?.existing) {
    throw new Error("parameter.examples.existing must be defined");
  }
  if (!parameter.examples?.nonExisting) {
    throw new Error("parameter.examples.nonExisting must be defined");
  }
  const existingParameter = resolveObject(api, parameter.examples?.existing);
  const nonExistingParameterValue = resolveObject(
    api,
    parameter.examples?.nonExisting
  );
  interpolateAST(file, {
    PATHNAME: builders.stringLiteral(pathname),
    /** @todo get status code from operation */
    STATUS: builders.numericLiteral(Number(STATUS_OK)),
    CONTENT_TYPE: content.type,
    CONTENT_ID: getInstanceId(content.type),
    CONTENT: jsonToExpression(responseContentSchema.example),
    RESOURCE: builders.stringLiteral(resource),
    PARAM: builders.stringLiteral(parameter.name),
    EXISTING_PARAM: builders.identifier(
      camelCase(["existing", parameter.name].join(" "))
    ),
    NON_EXISTING_PARAM: builders.identifier(
      camelCase(["nonExisting", parameter.name].join(" "))
    ),
    EXISTING_PARAM_VALUE: jsonToExpression(existingParameter),
    NON_EXISTING_PARAM_VALUE: jsonToExpression(nonExistingParameterValue),
  });
  return file;
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
