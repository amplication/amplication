import * as path from "path";
import { print } from "recast";
import { builders, namedTypes } from "ast-types";

import {
  OpenAPIObject,
  PathObject,
  OperationObject,
  SchemaObject,
  ParameterObject,
} from "openapi3-ts";
import { Module, readFile, relativeImportPath } from "../../util/module";
import {
  interpolateAST,
  docComment,
  getMethodFromTemplateAST,
  getLastStatementFromFile,
  getImportDeclarations,
  consolidateImports,
  removeTSIgnoreComments,
  importNames,
  addImports,
} from "../../util/ast";
import {
  HTTPMethod,
  getResponseContentSchema,
  getRequestBodySchema,
  STATUS_OK,
  JSON_MIME,
  STATUS_CREATED,
  getOperations,
  getParameters,
  getExpressVersion,
  dereference,
} from "../../util/open-api";
import {
  createParamsType,
  createQueryType,
  schemaToType,
} from "../../util/open-api-code-generation";

const controllerTemplatePath = require.resolve("./templates/controller.ts");
const controllerFindOneTemplatePath = require.resolve(
  "./templates/find-one.ts"
);
const controllerFindManyTemplatePath = require.resolve(
  "./templates/find-many.ts"
);
const controllerCreateTemplatePath = require.resolve("./templates/create.ts");

export async function createControllerModule(
  api: OpenAPIObject,
  paths: PathObject,
  resource: string,
  entity: string,
  entityType: string,
  entityServiceModule: string
): Promise<Module> {
  const modulePath = path.join(entity, `${entity}.controller.ts`);
  const imports: namedTypes.ImportDeclaration[] = [];
  const methods: namedTypes.ClassMethod[] = [];
  for (const { path, httpMethod, operation } of getOperations(paths)) {
    const ast = await createControllerMethod(
      api,
      resource,
      httpMethod as HTTPMethod,
      path,
      operation as OperationObject
    );
    const moduleImports = getImportDeclarations(ast);
    const method = getMethodFromTemplateAST(ast);
    methods.push(method);
    imports.push(...moduleImports);
  }

  const file = await readFile(controllerTemplatePath);

  const serviceId = builders.identifier(`${entityType}Service`);

  interpolateAST(file, {
    RESOURCE: builders.stringLiteral(resource),
    CONTROLLER: builders.identifier(`${entityType}Controller`),
    SERVICE: serviceId,
  });

  const moduleImports = getImportDeclarations(file);
  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(modulePath, entityServiceModule)
  );

  const allImports = [...moduleImports, ...imports, serviceImport];

  const consolidatedImports = consolidateImports(allImports);

  const exportNamedDeclaration = getLastStatementFromFile(
    file
  ) as namedTypes.ExportNamedDeclaration;

  const classDeclaration = exportNamedDeclaration.declaration as namedTypes.ClassDeclaration;

  classDeclaration.body.body.push(...methods);

  const nextAst = builders.file(
    builders.program([...consolidatedImports, exportNamedDeclaration])
  );

  removeTSIgnoreComments(nextAst);

  return {
    path: modulePath,
    code: print(nextAst).code,
  };
}

async function createControllerMethod(
  api: OpenAPIObject,
  resource: string,
  method: HTTPMethod,
  route: string,
  operation: OperationObject
): Promise<namedTypes.File> {
  const parameters = getParameters(api, operation);
  const operationPath = route.replace(`/${resource}`, "");
  switch (method) {
    case HTTPMethod.get: {
      const contentSchemaRef = getResponseContentSchema(
        operation,
        STATUS_OK,
        JSON_MIME
      );
      const contentSchema = dereference(api, contentSchemaRef);
      switch (contentSchema.type) {
        case "object": {
          return createFindOne(
            operation,
            parameters,
            contentSchema,
            operationPath
          );
        }
        case "array": {
          return createFindMany(operation, parameters, contentSchema);
        }
      }
    }
    case HTTPMethod.post: {
      return createCreate(api, operation, parameters);
    }
    default: {
      throw new Error(`Unknown method: ${method}`);
    }
  }
}

async function createFindOne(
  operation: OperationObject,
  parameters: ParameterObject[],
  contentSchema: SchemaObject,
  operationPath: string
): Promise<namedTypes.File> {
  if (!operation.summary) {
    throw new Error("operation.summary must be defined");
  }

  const file = await readFile(controllerFindOneTemplatePath);
  const content = schemaToType(contentSchema);
  const path = getExpressVersion(operationPath).slice(1);

  interpolateAST(file, {
    CONTENT: content.type,
    PATH: builders.stringLiteral(path),
    PARAMS: createParamsType(parameters),
    QUERY: createQueryType(parameters),
  });

  const method = getMethodFromTemplateAST(file);
  method.comments = [docComment(operation.summary)];

  addImports(file, content.imports);

  return file;
}

async function createFindMany(
  operation: OperationObject,
  parameters: ParameterObject[],
  contentSchema: SchemaObject
): Promise<namedTypes.File> {
  if (!operation.summary) {
    throw new Error("operation.summary must be defined");
  }
  const file = await readFile(controllerFindManyTemplatePath);
  const content = schemaToType(contentSchema);

  interpolateAST(file, {
    CONTENT: content.type,
    QUERY: createQueryType(parameters),
  });

  const method = getMethodFromTemplateAST(file);
  method.comments = [docComment(operation.summary)];

  addImports(file, content.imports);

  return file;
}

async function createCreate(
  api: OpenAPIObject,
  operation: OperationObject,
  parameters: ParameterObject[]
): Promise<namedTypes.File> {
  if (!operation.summary) {
    throw new Error("operation.summary must be defined");
  }
  const bodySchema = getRequestBodySchema(api, operation, JSON_MIME);
  /** @todo get status code from operation */
  const contentSchema = getResponseContentSchema(
    operation,
    STATUS_CREATED,
    JSON_MIME
  );
  const bodyType = schemaToType(bodySchema);
  const content = schemaToType(contentSchema);
  const file = await readFile(controllerCreateTemplatePath);

  interpolateAST(file, {
    CONTENT: content.type,
    BODY_TYPE: bodyType.type,
    QUERY: createQueryType(parameters),
  });

  const method = getMethodFromTemplateAST(file);
  method.comments = [docComment(operation.summary)];

  addImports(file, [...bodyType.imports, ...content.imports]);

  return file;
}
