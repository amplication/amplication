import * as path from "path";
import {
  PathObject,
  OpenAPIObject,
  OperationObject,
  SchemaObject,
  PathsObject,
} from "openapi3-ts";
import { print } from "recast";
import { namedTypes, builders } from "ast-types";
import { Module, relativeImportPath, readFile } from "../../util/module";
import {
  interpolateAST,
  parse,
  getImportDeclarations,
  getMethodFromTemplateAST,
  removeTSIgnoreComments,
  importNames,
} from "../../util/ast";
import {
  HTTPMethod,
  getContentSchemaRef,
  resolveRef,
  removeSchemaPrefix,
  getOperations,
} from "../../util/open-api";

const serviceTemplatePath = require.resolve("./templates/service.ts");
const serviceFindOneTemplatePath = require.resolve("./templates/find-one.ts");
const serviceFindManyTemplatePath = require.resolve("./templates/find-many.ts");
const serviceCreateTemplatePath = require.resolve("./templates/create.ts");

export async function createServiceModule(
  api: OpenAPIObject,
  paths: PathsObject,
  entity: string,
  entityType: string,
  entityDTOModule: string
): Promise<Module> {
  const modulePath = path.join(entity, `${entity}.service.ts`);
  const imports: namedTypes.ImportDeclaration[] = [];
  const methods: namedTypes.ClassMethod[] = [];
  for (const { httpMethod, operation } of getOperations(paths)) {
    const ast = await getServiceMethod(
      api,
      entityType,
      httpMethod as HTTPMethod,
      operation as OperationObject,
      modulePath
    );
    const moduleImports = getImportDeclarations(ast);
    const method = getMethodFromTemplateAST(ast);
    imports.push(...moduleImports);
    methods.push(method);
  }
  const file = await readFile(serviceTemplatePath);

  interpolateAST(file, {
    ENTITY: builders.identifier(entityType),
    SERVICE: builders.identifier(`${entityType}Service`),
    FIND_ONE_ARGS: builders.identifier(`FindOne${entityType}Args`),
    FIND_MANY_ARGS: builders.identifier(`FindMany${entityType}Args`),
  });

  const dtoImport = importNames(
    [builders.identifier(entityType)],
    relativeImportPath(modulePath, entityDTOModule)
  );

  const allImports = [...imports, dtoImport];

  file.program.body.splice(file.program.body.length - 1, 0, ...allImports);

  const exportNamedDeclaration = file.program.body[
    file.program.body.length - 1
  ] as namedTypes.ExportNamedDeclaration;
  const classDeclaration = exportNamedDeclaration.declaration as namedTypes.ClassDeclaration;
  classDeclaration.body.body.push(...methods);

  removeTSIgnoreComments(file);

  return {
    path: modulePath,
    code: print(file).code,
  };
}

async function getServiceMethod(
  api: OpenAPIObject,
  entityType: string,
  method: HTTPMethod,
  operation: OperationObject,
  modulePath: string
): Promise<namedTypes.File> {
  switch (method) {
    case HTTPMethod.get: {
      const response = operation.responses["200"];
      const ref = getContentSchemaRef(response.content);
      const schema = resolveRef(api, ref) as SchemaObject;
      switch (schema.type) {
        case "object": {
          return createFindOne(operation, entityType);
        }
        case "array": {
          if (!operation.parameters) {
            throw new Error("operation.parameters must be defined");
          }
          return createFindMany(operation, entityType);
        }
      }
    }
    case HTTPMethod.post: {
      if (
        !(
          operation.requestBody &&
          "content" in operation.requestBody &&
          "application/json" in operation.requestBody.content &&
          operation.requestBody.content["application/json"].schema &&
          "$ref" in operation.requestBody.content["application/json"].schema
        )
      ) {
        throw new Error(
          "Operation must have requestBody.content['application/json'].schema['$ref'] defined"
        );
      }
      const bodyType = removeSchemaPrefix(
        operation.requestBody.content["application/json"].schema["$ref"]
      );
      const ast = await createCreate(operation, entityType, bodyType);

      const dtoModule = path.join("dto", bodyType + ".ts");
      const dtoModuleImport = relativeImportPath(modulePath, dtoModule);

      ast.program.body.unshift(
        importNames([builders.identifier(bodyType)], dtoModuleImport)
      );

      return ast;
    }
    default: {
      throw new Error(`Unknown method: ${method}`);
    }
  }
}

async function createFindMany(
  operation: OperationObject,
  entityType: string
): Promise<namedTypes.File> {
  const file = await readFile(serviceFindManyTemplatePath);
  interpolateAST(file, {
    DELEGATE: builders.identifier(operation["x-entity"]),
    ENTITY: builders.identifier(entityType),
    ARGS: builders.identifier(`FindMany${entityType}Args`),
  });
  return file;
}

async function createFindOne(
  operation: OperationObject,
  entityType: string
): Promise<namedTypes.File> {
  const file = await readFile(serviceFindOneTemplatePath);
  interpolateAST(file, {
    DELEGATE: builders.identifier(operation["x-entity"]),
    ENTITY: builders.identifier(entityType),
    ARGS: builders.identifier(`FindOne${entityType}Args`),
  });
  return file;
}

async function createCreate(
  operation: OperationObject,
  entityType: string,
  data: string
): Promise<namedTypes.File> {
  const file = await readFile(serviceCreateTemplatePath);
  interpolateAST(file, {
    DELEGATE: builders.identifier(operation["x-entity"]),
    ENTITY: builders.identifier(entityType),
    ARGS: builders.identifier(`Create${entityType}Args`),
    DATA: builders.identifier(data),
  });
  return file;
}
