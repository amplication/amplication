import * as path from "path";
import {
  OpenAPIObject,
  OperationObject,
  SchemaObject,
  PathsObject,
} from "openapi3-ts";
import { print } from "recast";
import { namedTypes, builders } from "ast-types";
import { Module, readFile } from "../../util/module";
import {
  interpolateAST,
  getImportDeclarations,
  getMethodFromTemplateAST,
  removeTSIgnoreComments,
  consolidateImports,
} from "../../util/ast";
import {
  HTTPMethod,
  getContentSchema,
  getOperations,
  JSON_MIME,
  STATUS_OK,
  dereference,
} from "../../util/open-api";
import {
  PrismaAction,
  createPrismaArgsID,
  createPrismaEntityID,
  importNamesFromPrisma,
} from "../../util/prisma-code-generation";

const serviceTemplatePath = require.resolve("./templates/service.ts");
const serviceFindOneTemplatePath = require.resolve("./templates/find-one.ts");
const serviceFindManyTemplatePath = require.resolve("./templates/find-many.ts");
const serviceCreateTemplatePath = require.resolve("./templates/create.ts");

export async function createServiceModule(
  api: OpenAPIObject,
  paths: PathsObject,
  entity: string,
  entityType: string
): Promise<Module> {
  const modulePath = path.join(entity, `${entity}.service.ts`);
  const imports: namedTypes.ImportDeclaration[] = [];
  const methods: namedTypes.ClassMethod[] = [];
  for (const { httpMethod, operation } of getOperations(paths)) {
    const ast = await getServiceMethod(
      api,
      httpMethod as HTTPMethod,
      operation as OperationObject
    );
    const moduleImports = getImportDeclarations(ast);
    const method = getMethodFromTemplateAST(ast);
    imports.push(...moduleImports);
    methods.push(method);
  }
  const file = await readFile(serviceTemplatePath);

  interpolateAST(file, {
    SERVICE: builders.identifier(`${entityType}Service`),
  });

  file.program.body.splice(
    file.program.body.length - 1,
    0,
    ...consolidateImports(imports)
  );

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
  method: HTTPMethod,
  operation: OperationObject
): Promise<namedTypes.File> {
  switch (method) {
    case HTTPMethod.get: {
      const response = operation.responses[STATUS_OK];
      const schema = dereference(
        api,
        getContentSchema(response.content, JSON_MIME)
      );
      switch (schema.type) {
        case "object": {
          return createFindOne(operation);
        }
        case "array": {
          return createFindMany(operation);
        }
      }
    }
    case HTTPMethod.post: {
      return createCreate(operation);
    }
    default: {
      throw new Error(`Unknown method: ${method}`);
    }
  }
}

async function createFindMany(
  operation: OperationObject
): Promise<namedTypes.File> {
  const file = await readFile(serviceFindManyTemplatePath);
  const entity = operation["x-entity"];
  const entityId = createPrismaEntityID(entity);
  const argsId = createPrismaArgsID(PrismaAction.FindMany, entity);

  interpolateAST(file, {
    DELEGATE: builders.identifier(entity),
    ENTITY: entityId,
    ARGS: argsId,
  });

  file.program.body.unshift(importNamesFromPrisma([entityId, argsId]));

  return file;
}

async function createFindOne(
  operation: OperationObject
): Promise<namedTypes.File> {
  const file = await readFile(serviceFindOneTemplatePath);
  const entity = operation["x-entity"];
  const entityId = createPrismaEntityID(entity);
  const argsId = createPrismaArgsID(PrismaAction.FindOne, entity);

  interpolateAST(file, {
    DELEGATE: builders.identifier(entity),
    ENTITY: entityId,
    ARGS: argsId,
  });

  file.program.body.unshift(importNamesFromPrisma([entityId, argsId]));

  return file;
}

async function createCreate(
  operation: OperationObject
): Promise<namedTypes.File> {
  const file = await readFile(serviceCreateTemplatePath);
  const entity = operation["x-entity"];
  const entityId = createPrismaEntityID(entity);
  const argsId = createPrismaArgsID(PrismaAction.Create, entity);

  interpolateAST(file, {
    DELEGATE: builders.identifier(entity),
    ENTITY: entityId,
    ARGS: argsId,
  });

  file.program.body.unshift(importNamesFromPrisma([entityId, argsId]));

  return file;
}
