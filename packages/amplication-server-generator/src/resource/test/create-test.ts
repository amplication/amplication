import * as path from "path";
import { namedTypes, builders } from "ast-types";
import { print } from "recast";
import {
  OperationObject,
  OpenAPIObject,
  PathsObject,
  ReferenceObject,
  SchemaObject,
  isReferenceObject,
} from "openapi3-ts";
import { camelCase } from "camel-case";
import { pascalCase } from "pascal-case";
import { readFile, Module, relativeImportPath } from "../../util/module";
import {
  interpolate,
  getTopLevelConstants,
  getImportDeclarations,
  removeTSVariableDeclares,
  findCallExpressionByCalleeId,
  findVariableDeclaratorById,
  findCallExpressionsByCalleeId,
  matchIdentifier,
  singleConstantDeclaration,
  importNames,
  getInstanceId,
  jsonToExpression,
  addImports,
  removeTSClassDeclares,
} from "../../util/ast";
import {
  getRequestBodySchema,
  JSON_MIME,
  STATUS_CREATED,
  HTTPMethod,
  getOperations,
  getResponseContentSchema,
  STATUS_OK,
  getParameters,
  dereference,
} from "../../util/open-api";
import { schemaToType } from "../../util/open-api-code-generation";

const testTemplatePath = require.resolve("./templates/test.ts");
const createTemplatePath = require.resolve("./templates/create.ts");
const findManyTemplatePath = require.resolve("./templates/find-many.ts");
const findOneTemplatePath = require.resolve("./templates/find-one.ts");

const SERVICE_ID = builders.identifier("service");
const DESCRIBE_ID = builders.identifier("describe");
const TEST_ID = builders.identifier("test");

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
    operations.map(({ path, httpMethod, operation }) =>
      getTests(api, resource, httpMethod, path, operation)
    )
  );
  for (const moduleAst of moduleASTs) {
    removeTSVariableDeclares(moduleAst);
    const moduleConstants = getTopLevelConstants(moduleAst);
    const serviceObject = findServiceObject(moduleAst);

    serviceProperties.push(...serviceObject.properties);
    const restConstants = moduleConstants.filter(
      (constant) => !matchIdentifier(constant.id, SERVICE_ID)
    );
    const moduleTests = findCallExpressionsByCalleeId(moduleAst, TEST_ID);

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

  interpolate(file, {
    TEST_NAME: builders.stringLiteral(entityType),
    MODULE: moduleId,
    SERVICE: serviceId,
  });

  const describe = findCallExpressionByCalleeId(file, DESCRIBE_ID);

  if (!describe) {
    throw new Error("No call to describe() was found");
  }

  const [, describeFn] = describe.arguments as [
    namedTypes.Identifier,
    namedTypes.FunctionExpression
  ];

  describeFn.body.body.push(...tests.map(builders.expressionStatement));

  const importResourceModule = importNames(
    [moduleId],
    relativeImportPath(modulePath, entityModule)
  );
  const importService = importNames(
    [serviceId],
    relativeImportPath(modulePath, entityServiceModule)
  );

  addImports(file, [...imports, importResourceModule, importService]);

  const service = findServiceObject(file);
  service.properties = serviceProperties;

  const constantDeclarations = constants.map(singleConstantDeclaration);

  file.program.body.splice(
    file.program.body.length - 2,
    0,
    ...constantDeclarations
  );

  removeTSVariableDeclares(file);
  removeTSClassDeclares(file);

  return {
    path: modulePath,
    code: print(file).code,
  };
}

function getTests(
  api: OpenAPIObject,
  resource: string,
  httpMethod: HTTPMethod,
  path: string,
  operation: OperationObject
): Promise<namedTypes.File> {
  switch (httpMethod) {
    case HTTPMethod.post: {
      return createCreate(api, path, operation);
    }
    case HTTPMethod.get: {
      /** @todo get status code from operation */
      const responseContentSchemaRef = getResponseContentSchema(
        operation,
        STATUS_OK,
        JSON_MIME
      );
      if (!isReferenceObject(responseContentSchemaRef)) {
        throw new Error("Response content schema must be a reference");
      }
      const responseContentSchema = dereference<SchemaObject>(
        api,
        responseContentSchemaRef
      );
      switch (responseContentSchema.type) {
        case "array": {
          return createFindMany(
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
}

async function createCreate(
  api: OpenAPIObject,
  pathname: string,
  operation: OperationObject
): Promise<namedTypes.File> {
  const file = await readFile(createTemplatePath);
  const bodySchemaRef = getRequestBodySchema(api, operation, JSON_MIME);
  const bodySchema = dereference(api, bodySchemaRef);
  const bodyType = schemaToType(bodySchemaRef);
  const bodyId = getInstanceId(bodyType.type);
  /** @todo get status code from operation */
  const responseContentSchemaRef = getResponseContentSchema(
    operation,
    STATUS_CREATED,
    JSON_MIME
  );
  const responseContentSchema = dereference(api, responseContentSchemaRef);
  const content = schemaToType(responseContentSchemaRef);
  const responseContentId = getInstanceId(content.type);

  interpolate(file, {
    PATHNAME: builders.stringLiteral(pathname),
    /** @todo get status code from operation */
    STATUS_CODE: builders.numericLiteral(Number(STATUS_CREATED)),
    BODY_TYPE: bodyType.type,
    BODY_ID: bodyId,
    BODY: jsonToExpression(bodySchema.example),
    CONTENT: jsonToExpression(responseContentSchema.example),
    CONTENT_TYPE: content.type,
    CONTENT_ID: builders.identifier(
      "created" + pascalCase(responseContentId.name)
    ),
  });

  addImports(file, bodyType.imports);

  return file;
}

async function createFindMany(
  pathname: string,
  responseContentSchemaRef: ReferenceObject,
  responseContentSchema: SchemaObject
): Promise<namedTypes.File> {
  const file = await readFile(findManyTemplatePath);
  const content = schemaToType(responseContentSchemaRef);
  interpolate(file, {
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
  responseContentSchemaRef: ReferenceObject,
  responseContentSchema: SchemaObject
): Promise<namedTypes.File> {
  const file = await readFile(findOneTemplatePath);
  const content = schemaToType(responseContentSchemaRef);
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
  const existingParameter = dereference(api, parameter.examples?.existing);
  const nonExistingParameterValue = dereference(
    api,
    parameter.examples?.nonExisting
  );
  interpolate(file, {
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
function findServiceObject(file: namedTypes.File): namedTypes.ObjectExpression {
  const serviceId = builders.identifier("service");
  const variable = findVariableDeclaratorById(file, serviceId);
  if (!variable) {
    throw new Error("No variable named service was found in file");
  }
  if (variable?.init?.type !== "ObjectExpression") {
    throw new Error("The service variable must be initialized with an object");
  }
  return variable.init;
}
