import * as path from "path";
import {
  OpenAPIObject,
  PathObject,
  OperationObject,
  SchemaObject,
} from "openapi3-ts";
import {
  createModuleFromTemplate,
  Module,
  readCode,
  relativeImportPath,
  interpolate,
} from "../util/module";
import {
  HTTPMethod,
  getExpressVersion,
  resolveRef,
  getContentSchemaRef,
} from "../util/open-api";

const controllerTemplatePath = require.resolve(
  "./templates/controller/controller.ts"
);
const controllerFindOneTemplatePath = require.resolve(
  "./templates/controller/find-one.ts"
);
const controllerFindManyTemplatePath = require.resolve(
  "./templates/controller/find-many.ts"
);
const controllerCreateTemplatePath = require.resolve(
  "./templates/controller/create.ts"
);

export async function createControllerModule(
  api: OpenAPIObject,
  paths: PathObject,
  entity: string,
  entityType: string,
  entityDTOModule: string,
  entityServiceModule: string
): Promise<Module> {
  const methods: string[] = [];
  for (const [path, pathSpec] of Object.entries(paths)) {
    for (const [method, operation] of Object.entries(pathSpec)) {
      const controllerMethod = await getControllerMethod(
        api,
        entityType,
        method as HTTPMethod,
        path,
        operation as OperationObject
      );
      methods.push(controllerMethod);
    }
  }
  const modulePath = path.join(entity, `${entity}.controller.ts`);
  return createModuleFromTemplate(modulePath, controllerTemplatePath, {
    ENTITY: entityType,
    ENTITY_DTO_MODULE: relativeImportPath(modulePath, entityDTOModule),
    ENTITY_SERVICE_MODULE: relativeImportPath(modulePath, entityServiceModule),
    METHODS: methods.join("\n"),
  });
}

async function getControllerMethod(
  api: OpenAPIObject,
  entityType: string,
  method: HTTPMethod,
  path: string,
  operation: OperationObject
): Promise<string> {
  if (!api?.components?.schemas) {
    throw new Error("api.components.schemas must be defined");
  }
  /** @todo handle deep paths */
  const [, , parameter] = getExpressVersion(path).split("/");
  switch (method) {
    case HTTPMethod.get: {
      /** @todo use path */
      const response = operation.responses["200"];
      const ref = getContentSchemaRef(response.content);
      const schema = resolveRef(api, ref) as SchemaObject;
      if (!schema) {
        throw new Error(`Invalid ref: ${ref}`);
      }
      switch (schema.type) {
        case "object": {
          const controllerFindOneTemplate = await readCode(
            controllerFindOneTemplatePath
          );
          return interpolate(controllerFindOneTemplate, {
            COMMENT: operation.summary,
            ENTITY: entityType,
            PATH: parameter,
          });
        }
        case "array": {
          const controllerFindManyTemplate = await readCode(
            controllerFindManyTemplatePath
          );
          return interpolate(controllerFindManyTemplate, {
            COMMENT: operation.summary,
            ENTITY: entityType,
          });
        }
      }
    }
    case HTTPMethod.post: {
      if (operation.requestBody) {
        if (!("content" in operation.requestBody)) {
          throw new Error();
        }
        const controllerCreateTemplate = await readCode(
          controllerCreateTemplatePath
        );
        return interpolate(controllerCreateTemplate, {
          COMMENT: operation.summary,
          ENTITY: entityType,
        });
      }
    }
    default: {
      throw new Error(`Unknown method: ${method}`);
    }
  }
}
