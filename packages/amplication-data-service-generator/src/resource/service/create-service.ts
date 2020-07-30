import * as path from "path";
import { OpenAPIObject, OperationObject, PathsObject } from "openapi3-ts";
import { print } from "recast";
import { namedTypes, builders } from "ast-types";
import { Module, readFile } from "../../util/module";
import {
  interpolate,
  getImportDeclarations,
  getMethodFromTemplateAST,
  removeTSIgnoreComments,
  addImports,
  removeTSVariableDeclares,
  findClassDeclarationById,
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
    const file = await getServiceMethod(
      api,
      httpMethod as HTTPMethod,
      operation as OperationObject
    );
    const moduleImports = getImportDeclarations(file);
    const method = getMethodFromTemplateAST(file);
    imports.push(...moduleImports);
    methods.push(method);
  }
  const file = await readFile(serviceTemplatePath);
  const serviceId = builders.identifier(`${entityType}Service`);

  interpolate(file, {
    SERVICE: serviceId,
  });

  const classDeclaration = findClassDeclarationById(file, serviceId);

  if (!classDeclaration) {
    throw new Error("Class must be defined");
  }

  classDeclaration.body.body.push(...methods);

  addImports(file, imports);
  removeTSIgnoreComments(file);
  removeTSVariableDeclares(file);

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

  interpolate(file, {
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

  interpolate(file, {
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

  interpolate(file, {
    DELEGATE: builders.identifier(entity),
    ENTITY: entityId,
    ARGS: argsId,
  });

  file.program.body.unshift(importNamesFromPrisma([entityId, argsId]));

  return file;
}
