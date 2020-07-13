import * as path from "path";
import {
  createModuleFromTemplate,
  Module,
  relativeImportPath,
  readCode,
  interpolate,
} from "../module.util";
import {
  PathObject,
  OpenAPIObject,
  OperationObject,
  SchemaObject,
} from "openapi3-ts";
import { SchemaToDelegate } from "../open-api-primsa";
import { HTTPMethod, getContentSchemaRef, resolveRef } from "../open-api.util";

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

export async function createServiceModule(
  api: OpenAPIObject,
  paths: PathObject,
  entity: string,
  entityType: string,
  entityDTOModule: string,
  schemaToDelegate: SchemaToDelegate
): Promise<Module> {
  const methods: string[] = [];
  for (const pathSpec of Object.values(paths)) {
    for (const [method, operation] of Object.entries(pathSpec)) {
      const methodCode = await getServiceMethod(
        api,
        entityType,
        method as HTTPMethod,
        operation as OperationObject,
        schemaToDelegate
      );
      methods.push(methodCode);
    }
  }
  const modulePath = path.join(entity, `${entity}.service.ts`);
  return createModuleFromTemplate(modulePath, serviceTemplatePath, {
    ENTITY: entityType,
    ENTITY_DTO_MODULE: relativeImportPath(modulePath, entityDTOModule),
    METHODS: methods.join("\n"),
  });
}

async function getServiceMethod(
  api: OpenAPIObject,
  entityType: string,
  method: HTTPMethod,
  operation: OperationObject,
  schemaToDelegate: SchemaToDelegate
): Promise<string> {
  switch (method) {
    case HTTPMethod.get: {
      const response = operation.responses["200"];
      const ref = getContentSchemaRef(response.content);
      const schema = resolveRef(api, ref) as SchemaObject;
      const delegate = schemaToDelegate[ref];
      switch (schema.type) {
        case "object": {
          const serviceFindOneTemplate = await readCode(
            serviceFindOneTemplatePath
          );
          return interpolate(serviceFindOneTemplate, {
            DELEGATE: delegate,
            ENTITY: entityType,
          });
        }
        case "array": {
          const serviceFindManyTemplate = await readCode(
            serviceFindManyTemplatePath
          );
          return interpolate(serviceFindManyTemplate, {
            DELEGATE: delegate,
            ENTITY: entityType,
          });
        }
      }
    }
    case HTTPMethod.post: {
      if (!operation.requestBody || !("content" in operation.requestBody)) {
        throw new Error("Not implemented");
      }
      const ref = getContentSchemaRef(operation.requestBody.content);
      const delegate = schemaToDelegate[ref];
      const serviceCreateTemplate = await readCode(serviceCreateTemplatePath);
      return interpolate(serviceCreateTemplate, {
        DELEGATE: delegate,
        ENTITY: entityType,
      });
    }
    default: {
      throw new Error(`Unknown method: ${method}`);
    }
  }
}
