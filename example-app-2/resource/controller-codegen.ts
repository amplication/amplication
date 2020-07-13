import * as path from "path";
import {
  OpenAPIObject,
  PathObject,
  OperationObject,
  SchemaObject,
} from "openapi3-ts";
import * as t from "@babel/types";
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
  removeSchemaPrefix,
} from "../util/open-api";
import generate from "@babel/generator";

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
  const modulePath = path.join(entity, `${entity}.controller.ts`);
  const imports: t.ImportDeclaration[] = [];
  const methods: string[] = [];
  for (const [path, pathSpec] of Object.entries(paths)) {
    for (const [method, operation] of Object.entries(pathSpec)) {
      const controllerMethod = await getControllerMethod(
        api,
        entityType,
        method as HTTPMethod,
        path,
        operation as OperationObject,
        modulePath
      );
      methods.push(controllerMethod.code);
      imports.push(...controllerMethod.imports);
    }
  }

  return createModuleFromTemplate(modulePath, controllerTemplatePath, {
    ENTITY: entityType,
    ENTITY_DTO_MODULE: relativeImportPath(modulePath, entityDTOModule),
    ENTITY_SERVICE_MODULE: relativeImportPath(modulePath, entityServiceModule),
    METHODS: methods.join("\n"),
    IMPORTS: generate(t.program(imports)).code,
  });
}

async function getControllerMethod(
  api: OpenAPIObject,
  entityType: string,
  method: HTTPMethod,
  route: string,
  operation: OperationObject,
  modulePath: string
): Promise<{
  code: string;
  imports: t.ImportDeclaration[];
}> {
  if (!api?.components?.schemas) {
    throw new Error("api.components.schemas must be defined");
  }
  /** @todo handle deep paths */
  const [, , parameter] = getExpressVersion(route).split("/");
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
          const code = interpolate(controllerFindOneTemplate, {
            COMMENT: operation.summary,
            ENTITY: entityType,
            PATH: parameter,
          });
          return { code, imports: [] };
        }
        case "array": {
          const controllerFindManyTemplate = await readCode(
            controllerFindManyTemplatePath
          );
          const code = interpolate(controllerFindManyTemplate, {
            COMMENT: operation.summary,
            ENTITY: entityType,
          });
          return { code, imports: [] };
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
      const controllerCreateTemplate = await readCode(
        controllerCreateTemplatePath
      );
      const code = interpolate(controllerCreateTemplate, {
        COMMENT: operation.summary,
        ENTITY: entityType,
        BODY_TYPE: bodyType,
      });
      const dtoModule = path.join("dto", bodyType + ".ts");
      const dtoModuleImport = relativeImportPath(modulePath, dtoModule);
      return {
        code,
        imports: [
          t.importDeclaration(
            [t.importSpecifier(t.identifier(bodyType), t.identifier(bodyType))],
            t.stringLiteral(dtoModuleImport)
          ),
        ],
      };
    }
    default: {
      throw new Error(`Unknown method: ${method}`);
    }
  }
}
