import * as fs from "fs";
import * as path from "path";
import {
  PathObject,
  OpenAPIObject,
  OperationObject,
  SchemaObject,
} from "openapi3-ts";
import * as t from "@babel/types";
import generate from "@babel/generator";
import template from "@babel/template";
import {
  createModuleFromTemplate,
  Module,
  relativeImportPath,
} from "../util/module";
import { HTTPMethod, getContentSchemaRef, resolveRef } from "../util/open-api";
import {
  NamedFunctionDeclaration,
  transformFunctionToClassMethod,
} from "../util/babel";

const serviceTemplatePath = require.resolve("./templates/service/service.ts");
const serviceFindOneTemplatePath = require.resolve(
  "./templates/service/find-one.ts"
);
const serviceFindManyTemplatePath = require.resolve(
  "./templates/service/find-many.ts"
);
const serviceCreateTemplatePath = require.resolve(
  "./templates/service/create.ts"
);

const buildService = template.program(
  fs.readFileSync(serviceTemplatePath, "utf-8"),
  {
    plugins: ["typescript", "decorators-legacy"],
  }
);

const buildFindMany = template.statement(
  fs.readFileSync(serviceFindManyTemplatePath, "utf-8"),
  {
    plugins: ["typescript"],
  }
);

const buildFindOne = template.statement(
  fs.readFileSync(serviceFindOneTemplatePath, "utf-8"),
  {
    plugins: ["typescript"],
  }
);

const buildCreate = template.statement(
  fs.readFileSync(serviceCreateTemplatePath, "utf-8"),
  {
    plugins: ["typescript"],
  }
);

export async function createServiceModule(
  api: OpenAPIObject,
  paths: PathObject,
  entity: string,
  entityType: string,
  entityDTOModule: string
): Promise<Module> {
  const methods: t.ClassMethod[] = [];
  for (const pathSpec of Object.values(paths)) {
    for (const [method, operation] of Object.entries(pathSpec)) {
      const methodCode = await getServiceMethod(
        api,
        entityType,
        method as HTTPMethod,
        operation as OperationObject
      );
      methods.push(methodCode);
    }
  }
  const modulePath = path.join(entity, `${entity}.service.ts`);
  const service = buildService({
    ENTITY: entityType,
    ENTITY_DTO_MODULE: relativeImportPath(modulePath, entityDTOModule),
    SERVICE: `${entityType}Service`,
    FIND_ONE_ARGS: `FindOne${entityType}Args`,
    FIND_MANY_ARGS: `FindMany${entityType}Args`,
    CREATE_ARGS: `${entityType}CreateArgs`,
  });
  const exportNamedDeclaration = service.body[
    service.body.length - 1
  ] as t.ExportNamedDeclaration;
  const classDeclaration = exportNamedDeclaration.declaration as t.ClassDeclaration;
  classDeclaration.body.body.push(...methods);
  return {
    path: modulePath,
    code: generate(service, {
      decoratorsBeforeExport: true,
    }).code,
  };
}

async function getServiceMethod(
  api: OpenAPIObject,
  entityType: string,
  method: HTTPMethod,
  operation: OperationObject
): Promise<t.ClassMethod> {
  switch (method) {
    case HTTPMethod.get: {
      const response = operation.responses["200"];
      const ref = getContentSchemaRef(response.content);
      const schema = resolveRef(api, ref) as SchemaObject;
      switch (schema.type) {
        case "object": {
          const methodFunction = buildFindOne({
            DELEGATE: operation["x-entity"],
            ENTITY: entityType,
            ARGS: `FindOne${entityType}Args`,
          }) as NamedFunctionDeclaration;

          return transformFunctionToClassMethod(methodFunction);
        }
        case "array": {
          if (!operation.parameters) {
            throw new Error("operation.parameters must be defined");
          }
          const methodFunction = buildFindMany({
            DELEGATE: operation["x-entity"],
            ENTITY: entityType,
            ARGS: `FindMany${entityType}Args`,
          }) as NamedFunctionDeclaration;

          return transformFunctionToClassMethod(methodFunction);
        }
      }
    }
    case HTTPMethod.post: {
      if (!operation.requestBody || !("content" in operation.requestBody)) {
        throw new Error("Not implemented");
      }
      /** @todo use requestBody for type */
      const methodFunction = buildCreate({
        DELEGATE: operation["x-entity"],
        ENTITY: entityType,
        ARGS: `${entityType}CreateArgs`,
      }) as NamedFunctionDeclaration;

      return transformFunctionToClassMethod(methodFunction);
    }
    default: {
      throw new Error(`Unknown method: ${method}`);
    }
  }
}
