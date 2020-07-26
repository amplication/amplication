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
import { Module, relativeImportPath, readCode } from "../../util/module";
import {
  interpolateAST,
  parse,
  getImportDeclarations,
  getMethodFromTemplateAST,
  removeTSIgnoreComments,
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
  const template = await readCode(serviceTemplatePath);
  const ast = parse(template) as namedTypes.File;

  interpolateAST(ast, {
    ENTITY: builders.identifier(entityType),
    SERVICE: builders.identifier(`${entityType}Service`),
    FIND_ONE_ARGS: builders.identifier(`FindOne${entityType}Args`),
    FIND_MANY_ARGS: builders.identifier(`FindMany${entityType}Args`),
  });

  const dtoImport = builders.importDeclaration(
    [builders.importSpecifier(builders.identifier(entityType))],
    builders.stringLiteral(relativeImportPath(modulePath, entityDTOModule))
  );

  const allImports = [...imports, dtoImport];

  ast.program.body.splice(ast.program.body.length - 1, 0, ...allImports);

  const exportNamedDeclaration = ast.program.body[
    ast.program.body.length - 1
  ] as namedTypes.ExportNamedDeclaration;
  const classDeclaration = exportNamedDeclaration.declaration as namedTypes.ClassDeclaration;
  classDeclaration.body.body.push(...methods);

  removeTSIgnoreComments(ast);

  return {
    path: modulePath,
    code: print(ast).code,
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
        builders.importDeclaration(
          [builders.importSpecifier(builders.identifier(bodyType))],
          builders.stringLiteral(dtoModuleImport)
        )
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
  const template = await readCode(serviceFindManyTemplatePath);
  const ast = parse(template) as namedTypes.File;
  interpolateAST(ast, {
    DELEGATE: builders.identifier(operation["x-entity"]),
    ENTITY: builders.identifier(entityType),
    ARGS: builders.identifier(`FindMany${entityType}Args`),
  });
  return ast;
}

async function createFindOne(
  operation: OperationObject,
  entityType: string
): Promise<namedTypes.File> {
  const template = await readCode(serviceFindOneTemplatePath);
  const ast = parse(template) as namedTypes.File;
  interpolateAST(ast, {
    DELEGATE: builders.identifier(operation["x-entity"]),
    ENTITY: builders.identifier(entityType),
    ARGS: builders.identifier(`FindOne${entityType}Args`),
  });
  return ast;
}

async function createCreate(
  operation: OperationObject,
  entityType: string,
  data: string
): Promise<namedTypes.File> {
  const template = await readCode(serviceCreateTemplatePath);
  const ast = parse(template) as namedTypes.File;
  interpolateAST(ast, {
    DELEGATE: builders.identifier(operation["x-entity"]),
    ENTITY: builders.identifier(entityType),
    ARGS: builders.identifier(`Create${entityType}Args`),
    DATA: builders.identifier(data),
  });
  return ast;
}
