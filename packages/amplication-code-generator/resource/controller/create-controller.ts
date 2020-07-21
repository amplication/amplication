import * as path from "path";
import { print } from "recast";
import { builders, namedTypes } from "ast-types";

import {
  OpenAPIObject,
  PathObject,
  OperationObject,
  SchemaObject,
} from "openapi3-ts";
import { Module, readCode, relativeImportPath } from "../../util/module";
import {
  interpolateAST,
  docComment,
  getMethodFromTemplateAST,
  parse,
  getLastStatementFromFile,
  getImportDeclarations,
  consolidateImports,
  removeTSIgnoreComments,
} from "../../util/ast";
import {
  HTTPMethod,
  getExpressVersion,
  resolveRef,
  removeSchemaPrefix,
  getResponseContentSchemaRef,
  getRequestBodySchemaRef,
  STATUS_OK,
  JSON_MIME,
  STATUS_CREATED,
} from "../../util/open-api";
import {
  createParamsType,
  createQueryType,
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
  for (const [path, pathSpec] of Object.entries(paths)) {
    for (const [httpMethod, operation] of Object.entries(pathSpec)) {
      const ast = await createControllerMethod(
        api,
        httpMethod as HTTPMethod,
        path,
        operation as OperationObject,
        modulePath
      );
      const moduleImports = getImportDeclarations(ast);
      const method = getMethodFromTemplateAST(ast);
      methods.push(method);
      imports.push(...moduleImports);
    }
  }

  const template = await readCode(controllerTemplatePath);
  const ast = parse(template) as namedTypes.File;

  const serviceId = builders.identifier(`${entityType}Service`);

  interpolateAST(ast, {
    RESOURCE: builders.stringLiteral(resource),
    CONTROLLER: builders.identifier(`${entityType}Controller`),
    SERVICE: serviceId,
  });

  const moduleImports = getImportDeclarations(ast);
  const serviceImport = builders.importDeclaration(
    [builders.importSpecifier(serviceId)],
    builders.stringLiteral(relativeImportPath(modulePath, entityServiceModule))
  );

  const allImports = [...moduleImports, ...imports, serviceImport];

  const consolidatedImports = consolidateImports(allImports);

  const exportNamedDeclaration = getLastStatementFromFile(
    ast
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
  method: HTTPMethod,
  route: string,
  operation: OperationObject,
  modulePath: string
): Promise<namedTypes.File> {
  /** @todo handle deep paths */
  const [, , parameter] = getExpressVersion(route).split("/");
  switch (method) {
    case HTTPMethod.get: {
      /** @todo use path */
      const contentSchemaRef = getResponseContentSchemaRef(
        operation,
        STATUS_OK,
        JSON_MIME
      );
      const schema = resolveRef(api, contentSchemaRef) as SchemaObject;
      switch (schema.type) {
        case "object": {
          return createFindOne(
            operation,
            modulePath,
            contentSchemaRef,
            parameter
          );
        }
        case "array": {
          return createFindMany(operation, modulePath, contentSchemaRef);
        }
      }
    }
    case HTTPMethod.post: {
      return createCreate(operation, modulePath);
    }
    default: {
      throw new Error(`Unknown method: ${method}`);
    }
  }
}

async function createFindOne(
  operation: OperationObject,
  modulePath: string,
  contentSchemaRef: string,
  parameter: string
): Promise<namedTypes.File> {
  if (!operation.summary) {
    throw new Error("operation.summary must be defined");
  }

  const template = await readCode(controllerFindOneTemplatePath);
  const ast = parse(template) as namedTypes.File;
  const params = createParamsType(operation);
  const query = createQueryType(operation);
  const contentDTO = removeSchemaPrefix(contentSchemaRef);

  interpolateAST(ast, {
    CONTENT: builders.identifier(contentDTO),
    PATH: builders.stringLiteral(parameter),
    PARAMS: params,
    QUERY: query,
  });

  const method = getMethodFromTemplateAST(ast);
  method.comments = [docComment(operation.summary)];

  ast.program.body.unshift(createDTOModuleImport(contentDTO, modulePath));

  return ast;
}

async function createFindMany(
  operation: OperationObject,
  modulePath: string,
  contentSchemaRef: string
): Promise<namedTypes.File> {
  if (!operation.summary) {
    throw new Error("operation.summary must be defined");
  }
  const template = await readCode(controllerFindManyTemplatePath);
  const ast = parse(template) as namedTypes.File;
  const query = createQueryType(operation);
  const contentDTO = removeSchemaPrefix(contentSchemaRef);

  interpolateAST(ast, {
    CONTENT: builders.identifier(contentDTO),
    QUERY: query,
  });

  const method = getMethodFromTemplateAST(ast);
  method.comments = [docComment(operation.summary)];

  ast.program.body.unshift(createDTOModuleImport(contentDTO, modulePath));

  return ast;
}

async function createCreate(
  operation: OperationObject,
  modulePath: string
): Promise<namedTypes.File> {
  if (!operation.summary) {
    throw new Error("operation.summary must be defined");
  }
  const bodyType = removeSchemaPrefix(
    getRequestBodySchemaRef(operation, JSON_MIME)
  );
  const contentSchemaRef = getResponseContentSchemaRef(
    operation,
    STATUS_CREATED,
    JSON_MIME
  );
  const content = removeSchemaPrefix(contentSchemaRef);
  const template = await readCode(controllerCreateTemplatePath);
  const ast = parse(template) as namedTypes.File;

  interpolateAST(ast, {
    CONTENT: builders.identifier(content),
    BODY_TYPE: builders.identifier(bodyType),
    /** @todo use operation query parameters */
    QUERY: builders.tsTypeLiteral([]),
  });

  const method = getMethodFromTemplateAST(ast);
  method.comments = [docComment(operation.summary)];

  ast.program.body.unshift(createDTOModuleImport(bodyType, modulePath));

  return ast;
}

function createDTOModuleImport(
  dto: string,
  modulePath: string
): namedTypes.ImportDeclaration {
  const dtoModule = path.join("dto", dto + ".ts");
  const dtoModuleImport = relativeImportPath(modulePath, dtoModule);
  return builders.importDeclaration(
    [builders.importSpecifier(builders.identifier(dto))],
    builders.stringLiteral(dtoModuleImport)
  );
}
