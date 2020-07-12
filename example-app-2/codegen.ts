import * as fs from "fs";
import * as path from "path";
import {
  OpenAPIObject,
  OperationObject,
  SchemaObject,
  ContentObject,
  PathsObject,
  PathObject,
} from "openapi3-ts";
import { pascalCase } from "pascal-case";
import { singular } from "pluralize";

import { PrismaClient } from "@prisma/client";
import flatten = require("lodash.flatten");
import get = require("lodash.get");
import { toLowerCaseName } from "./string.util";
import { removeExt } from "./path.util";
import {
  ImportableModule,
  Module,
  interpolate,
  readCode,
  writeModules,
  createModuleFromTemplate,
} from "./module.util";
import { copyDirectory } from "./fs.utils";

const SCHEMA_PREFIX = "#/components/schemas/";
const OUTPUT_DIRECTORY = "dist";

type Method = "get" | "post" | "patch" | "put" | "delete";

type SchemaToDelegate = {
  [key: string]: string;
};

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
const moduleTemplatePath = require.resolve("./templates/module.ts");
const appModuleTemplatePath = require.resolve("./templates/app.module.ts");
const indexTemplatePath = require.resolve("./templates/index.ts");

const APP_MODULE_PATH = "app.module.ts";

export async function codegen(api: OpenAPIObject, client: PrismaClient) {
  const byResource = groupByResource(api);
  const schemaToDelegate = getSchemaToDelegate(api, client);
  const resourceModuleLists = await Promise.all(
    Object.entries(byResource).map(([resource, paths]) =>
      generateResource(api, resource, paths, schemaToDelegate)
    )
  );
  const resourceModules = flatten(resourceModuleLists);
  if (!api?.components?.schemas) {
    throw new Error("api.components.schemas must be defined");
  }
  const schemaModules = Object.entries(
    api.components.schemas
  ).map(([name, schema]) => schemaToModule(schema, name));
  const appModule = await createAppModule(resourceModules);

  const modules = [...resourceModules, ...schemaModules, appModule];

  await writeModules(modules, OUTPUT_DIRECTORY);

  await copyDirectory(
    path.join("templates", "prisma"),
    path.join(OUTPUT_DIRECTORY, "prisma")
  );

  await fs.promises.copyFile(
    indexTemplatePath,
    path.join(OUTPUT_DIRECTORY, "index.ts")
  );
}

async function createAppModule(
  resourceModules: ImportableModule[]
): Promise<Module> {
  const appModuleTemplate = await readCode(appModuleTemplatePath);
  const prismaModule: ImportableModule = {
    code: "",
    exports: ["PrismaModule"],
    path: "prisma/prisma.module.ts",
  };
  const nestModules = resourceModules
    .filter((module) => module.path.includes(".module."))
    .concat([prismaModule]);
  const imports = nestModules
    .map((module) => {
      const importPath = removeExt(module.path);
      return `import { ${module.exports[0]} } from "./${importPath}"`;
    })
    .join("\n");
  const modules = `[${nestModules
    .map((module) => module.exports[0])
    .join(", ")}]`;
  return {
    path: APP_MODULE_PATH,
    code: interpolate(appModuleTemplate, {
      IMPORTS: imports,
      MODULES: modules,
    }),
  };
}

type GroupedResourcePathsObject = { [resource: string]: PathsObject };

function groupByResource(api: OpenAPIObject): GroupedResourcePathsObject {
  const resources: GroupedResourcePathsObject = {};
  for (const [path, pathSpec] of Object.entries(api.paths)) {
    /** @todo handle deep paths */
    const parts = path.split("/");
    const [, resourcePart] = parts;
    resources[resourcePart] = resources[resourcePart] || {};
    resources[resourcePart][path] = pathSpec;
  }
  return resources;
}

async function generateResource(
  api: OpenAPIObject,
  resource: string,
  paths: PathObject,
  schemaToDelegate: SchemaObject
): Promise<ImportableModule[]> {
  const serviceMethods: string[] = [];
  const controllerMethods: string[] = [];
  const entity = singular(resource);
  const entityType = pascalCase(entity);
  const entityDTOModulePath = `${entityType}.ts`;
  const entityModulePath = `${entity}.module.ts`;
  const entityServiceModulePath = `${entity}.service.ts`;
  const entityControllerModulePath = `${entity}.controller.ts`;
  const entityDTOModule = `./${removeExt(entityDTOModulePath)}`;
  const entityModule = `./${removeExt(entityModulePath)}`;
  const entityServiceModule = `./${removeExt(entityServiceModulePath)}`;
  const entityControllerModule = `./${removeExt(entityControllerModulePath)}`;
  for (const [path, pathSpec] of Object.entries(paths)) {
    for (const [method, operationSpec] of Object.entries(pathSpec)) {
      const { controllerMethod, serviceMethod } = await getHandler(
        api,
        entityType,
        entityModule,
        entityServiceModule,
        method as Method,
        path,
        operationSpec as OperationObject,
        schemaToDelegate
      );
      controllerMethods.push(controllerMethod);
      serviceMethods.push(serviceMethod);
    }
  }

  /** @todo move from definition */
  const serviceModule = await createModuleFromTemplate(
    entityServiceModulePath,
    serviceTemplatePath,
    {
      ENTITY: entityType,
      ENTITY_DTO_MODULE: entityDTOModule,
      METHODS: serviceMethods.join("\n"),
    },
    [`${entityType}Service`]
  );

  const controllerModule = await createModuleFromTemplate(
    entityControllerModulePath,
    controllerTemplatePath,
    {
      ENTITY: entityType,
      ENTITY_DTO_MODULE: entityDTOModule,
      ENTITY_SERVICE_MODULE: entityServiceModule,
      METHODS: controllerMethods.join("\n"),
    },
    [`${entityType}Controller`]
  );

  const moduleModule = await createModuleFromTemplate(
    entityModulePath,
    moduleTemplatePath,
    {
      ENTITY: entityType,
      ENTITY_SERVICE_MODULE: entityServiceModule,
      ENTITY_CONTROLLER_MODULE: entityControllerModule,
    },
    [`${entityType}Module`]
  );

  return [serviceModule, controllerModule, moduleModule];
}

async function getHandler(
  api: OpenAPIObject,
  entityType: string,
  entityModule: string,
  entityServiceModule: string,
  method: Method,
  path: string,
  operation: OperationObject,
  schemaToDelegate: SchemaToDelegate
): Promise<{ serviceMethod: string; controllerMethod: string }> {
  if (!api?.components?.schemas) {
    throw new Error("api.components.schemas must be defined");
  }
  /** @todo handle deep paths */
  const [, , parameter] = getExpressVersion(path).split("/");
  switch (method) {
    case "get": {
      /** @todo use path */
      const response = operation.responses["200"];
      const ref = getContentSchemaRef(response.content);
      const schema = resolveRef(api, ref) as SchemaObject;
      const delegate = schemaToDelegate[ref];
      if (!schema) {
        throw new Error(`Invalid ref: ${ref}`);
      }
      switch (schema.type) {
        case "object": {
          const serviceFindOneTemplate = await readCode(
            serviceFindOneTemplatePath
          );
          const controllerFindOneTemplate = await readCode(
            controllerFindOneTemplatePath
          );
          return {
            serviceMethod: interpolate(serviceFindOneTemplate, {
              DELEGATE: delegate,
              ENTITY: entityType,
              ENTITY_MODULE: entityModule,
            }),
            controllerMethod: interpolate(controllerFindOneTemplate, {
              COMMENT: operation.summary,
              DELEGATE: delegate,
              ENTITY: entityType,
              ENTITY_MODULE: entityModule,
              ENTITY_SERVICE_MODULE: entityServiceModule,
              PATH: parameter,
            }),
          };
        }
        case "array": {
          const serviceFindManyTemplate = await readCode(
            serviceFindManyTemplatePath
          );
          const controllerFindManyTemplate = await readCode(
            controllerFindManyTemplatePath
          );
          return {
            serviceMethod: interpolate(serviceFindManyTemplate, {
              DELEGATE: delegate,
              ENTITY: entityType,
              ENTITY_MODULE: entityModule,
            }),
            controllerMethod: interpolate(controllerFindManyTemplate, {
              COMMENT: operation.summary,
              DELEGATE: delegate,
              ENTITY: entityType,
              ENTITY_MODULE: entityModule,
              ENTITY_SERVICE_MODULE: entityServiceModule,
            }),
          };
        }
      }
    }
    case "post": {
      if (operation.requestBody) {
        if (!("content" in operation.requestBody)) {
          throw new Error();
        }
        const ref = getContentSchemaRef(operation.requestBody.content);
        const delegate = schemaToDelegate[ref];
        const serviceCreateTemplate = await readCode(serviceCreateTemplatePath);
        const controllerCreateTemplate = await readCode(
          controllerCreateTemplatePath
        );
        return {
          serviceMethod: interpolate(serviceCreateTemplate, {
            DELEGATE: delegate,
            ENTITY: entityType,
            ENTITY_MODULE: entityModule,
          }),
          controllerMethod: interpolate(controllerCreateTemplate, {
            COMMENT: operation.summary,
            DELEGATE: delegate,
            ENTITY: entityType,
            ENTITY_MODULE: entityModule,
            ENTITY_SERVICE_MODULE: entityServiceModule,
          }),
        };
      }
    }
    default: {
      throw new Error(`Unknown method: ${method}`);
    }
  }
}

function getContentSchemaRef(content: ContentObject): string {
  const mediaType = content["application/json"];
  if (!mediaType.schema) {
    throw new Error("mediaType.schema must be defined");
  }
  return mediaType.schema["$ref"];
}

function schemaToModule(schema: SchemaObject, name: string): ImportableModule {
  return {
    code: schemaToCode(schema, name),
    path: `./${name}.ts`,
    exports: [name],
  };
}

function schemaToCode(schema: SchemaObject, name?: string): string {
  switch (schema.type) {
    case "string": {
      return "string";
    }
    case "number":
    case "integer": {
      return "number";
    }
    case "object": {
      if (!schema.properties) {
        throw new Error(
          "When schema.type is 'object' schema.properties must be defined"
        );
      }
      const properties = Object.entries(schema.properties).map(
        ([propertyName, property]) => {
          if ("$ref" in property) {
            throw new Error("Not implemented");
          }
          if (schema.required && schema.required.includes(propertyName)) {
            return `${propertyName}: ${schemaToCode(property)}`;
          } else {
            return `${propertyName}?: ${schemaToCode(property)}`;
          }
        }
      );
      return `export type ${name} = {${properties.join("\n")}}`;
    }
    case "array": {
      if (!schema.items) {
        throw new Error(
          "When schema.type is 'array' schema.properties must be defined"
        );
      }
      if (!("$ref" in schema.items)) {
        throw new Error("Not implemented");
      }
      const item = removeSchemaPrefix(schema.items.$ref);
      return `
      import { ${item} } from "./${item}";
      export type ${name} = ${item}[]
      `;
    }
    default: {
      throw new Error("Not implemented");
    }
  }
}

function resolveRef(api: OpenAPIObject, ref: string): Object {
  const parts = ref.split("/");
  const [firstPart, ...rest] = parts;
  if (firstPart !== "#") {
    throw new Error("Not implemented for references not starting with #/");
  }
  return get(api, rest);
}

/**
 * Returns a mapping between OpenAPI schemas to their matching Prisma delegates
 * @param api OpenAPI configuration
 * @param prismaClient initialized client of Prisma
 */
function getSchemaToDelegate(
  api: OpenAPIObject,
  prismaClient: PrismaClient
): SchemaToDelegate {
  const schemaToDelegate: SchemaToDelegate = {};
  if (!api?.components?.schemas) {
    throw new Error("api.components.schemas must be defined");
  }
  for (const [name, componentSchema] of Object.entries(
    api.components.schemas
  )) {
    const lowerCaseName = toLowerCaseName(name);
    // In case the name exists in Prisma
    if (lowerCaseName in prismaClient) {
      schemaToDelegate[prefixSchema(name)] = lowerCaseName;
      continue;
    }
    if ("type" in componentSchema) {
      switch (componentSchema.type) {
        case "array": {
          const { items } = componentSchema;
          if (items && "$ref" in items) {
            const itemsName = removeSchemaPrefix(items.$ref);
            const lowerCaseItemsName = toLowerCaseName(itemsName);
            // In case array items name exists in Prisma
            if (lowerCaseItemsName in prismaClient) {
              schemaToDelegate[prefixSchema(name)] = lowerCaseItemsName;
              continue;
            }
          }
        }
      }
    }
  }
  return schemaToDelegate;
}

function prefixSchema(name: string): string {
  return SCHEMA_PREFIX + name;
}

function removeSchemaPrefix(ref: string): string {
  return ref.replace(SCHEMA_PREFIX, "");
}

// Copied from https://github.com/isa-group/oas-tools/blob/5ee4506e4020671a11412d8d549da3e01c44c143/src/index.js
function getExpressVersion(oasPath: string): string {
  return oasPath.replace(/{/g, ":").replace(/}/g, "");
}
