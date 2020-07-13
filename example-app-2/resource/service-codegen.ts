import * as path from "path";
import {
  createModuleFromTemplate,
  Module,
  relativeImportPath,
  readCode,
  interpolate,
} from "../util/module";
import {
  PathObject,
  OpenAPIObject,
  OperationObject,
  SchemaObject,
} from "openapi3-ts";
import { HTTPMethod, getContentSchemaRef, resolveRef } from "../util/open-api";

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
  entityDTOModule: string
): Promise<Module> {
  const methods: string[] = [];
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
  operation: OperationObject
): Promise<string> {
  switch (method) {
    case HTTPMethod.get: {
      const response = operation.responses["200"];
      const ref = getContentSchemaRef(response.content);
      const schema = resolveRef(api, ref) as SchemaObject;
      switch (schema.type) {
        case "object": {
          const serviceFindOneTemplate = await readCode(
            serviceFindOneTemplatePath
          );
          return interpolate(serviceFindOneTemplate, {
            DELEGATE: operation["x-entity"],
            ENTITY: entityType,
          });
        }
        case "array": {
          const serviceFindManyTemplate = await readCode(
            serviceFindManyTemplatePath
          );
          return interpolate(serviceFindManyTemplate, {
            DELEGATE: operation["x-entity"],
            ENTITY: entityType,
          });
        }
      }
    }
    case HTTPMethod.post: {
      if (!operation.requestBody || !("content" in operation.requestBody)) {
        throw new Error("Not implemented");
      }
      /** @todo use requestBody for type */
      const serviceCreateTemplate = await readCode(serviceCreateTemplatePath);
      return interpolate(serviceCreateTemplate, {
        DELEGATE: operation["x-entity"],
        ENTITY: entityType,
      });
    }
    default: {
      throw new Error(`Unknown method: ${method}`);
    }
  }
}
