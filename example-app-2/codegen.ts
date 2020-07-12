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
import * as prettier from "prettier";
import { PrismaClient } from "@prisma/client";
import flatten = require("lodash.flatten");
import ncp = require("ncp");

const SCHEMA_PREFIX = "#/components/schemas/";
const OUTPUT_DIRECTORY = "dist";

type Method = "get" | "post" | "patch" | "put" | "delete";

type SchemaToDelegate = {
  [key: string]: {
    schema: SchemaObject;
    delegate: string;
  };
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

type Module = {
  path: string;
  code: string;
};

type ImportableModule = Module & {
  exports: string[];
};

export async function codegen(api: OpenAPIObject, client: PrismaClient) {
  const byResource = groupByResource(api);
  const schemaToDelegate = getSchemaToDelegate(api, client);
  const resourceModuleLists = await Promise.all(
    Object.entries(byResource).map(([resource, paths]) =>
      generateResource(resource, paths, schemaToDelegate)
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

  writeModules(modules);
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

async function writeModules(modules: Module[]): Promise<void> {
  await fs.promises.rmdir(OUTPUT_DIRECTORY, {
    recursive: true,
  });
  await fs.promises.mkdir(OUTPUT_DIRECTORY);
  for (const module of modules) {
    await fs.promises.writeFile(
      path.join(OUTPUT_DIRECTORY, module.path),
      prettier.format(module.code, { parser: "typescript" }),
      "utf-8"
    );
  }

  await new Promise((resolve, reject) => {
    ncp(
      path.join("templates", "prisma"),
      path.join(OUTPUT_DIRECTORY, "prisma"),
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });

  await fs.promises.copyFile(
    indexTemplatePath,
    path.join(OUTPUT_DIRECTORY, "index.ts")
  );
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
  resource: string,
  paths: PathObject,
  schemaToDelegate: SchemaObject
): Promise<ImportableModule[]> {
  const serviceTemplate = await readCode(serviceTemplatePath);
  const controllerTemplate = await readCode(controllerTemplatePath);
  const moduleTemplate = await readCode(moduleTemplatePath);
  const serviceMethods: string[] = [];
  const controllerMethods: string[] = [];
  const entity = singular(resource);
  const entityType = pascalCase(entity);
  const entityModule = `./${entityType}`;
  const entityServiceModule = `./${entity}.service`;
  const entityControllerModule = `./${entity}.controller`;
  for (const [path, pathSpec] of Object.entries(paths)) {
    for (const [method, operationSpec] of Object.entries(pathSpec)) {
      const { controllerMethod, serviceMethod } = await getHandler(
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

  const serviceModule: ImportableModule = {
    /** @todo move from definition */
    path: `${entity}.service.ts`,
    code: interpolate(serviceTemplate, {
      ENTITY: entityType,
      ENTITY_MODULE: entityModule,
      METHODS: serviceMethods.join("\n"),
    }),
    exports: [`${entityType}Service`],
  };
  const controllerModule: ImportableModule = {
    path: `${entity}.controller.ts`,
    code: interpolate(controllerTemplate, {
      ENTITY: entityType,
      ENTITY_MODULE: entityModule,
      ENTITY_SERVICE_MODULE: entityServiceModule,
      METHODS: controllerMethods.join("\n"),
    }),
    exports: [`${entityType}Controller`],
  };
  const moduleModule: ImportableModule = {
    path: `${entity}.module.ts`,
    code: interpolate(moduleTemplate, {
      ENTITY: entityType,
      ENTITY_SERVICE_MODULE: entityServiceModule,
      ENTITY_CONTROLLER_MODULE: entityControllerModule,
    }),
    exports: [`${entityType}Module`],
  };
  return [serviceModule, controllerModule, moduleModule];
}

async function getHandler(
  entityType: string,
  entityModule: string,
  entityServiceModule: string,
  method: Method,
  path: string,
  operation: OperationObject,
  schemaToDelegate: SchemaToDelegate
): Promise<{ serviceMethod: string; controllerMethod: string }> {
  /** @todo handle deep paths */
  const [, , parameter] = getExpressVersion(path).split("/");
  switch (method) {
    case "get": {
      /** @todo use path */
      const response = operation.responses["200"];
      const { delegate, schema } = contentToDelegate(
        schemaToDelegate,
        response.content
      );
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
        const { delegate } = contentToDelegate(
          schemaToDelegate,
          operation.requestBody.content
        );
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

function interpolate(
  code: string,
  variables: { [variable: string]: string | null | undefined }
) {
  for (const [variable, value] of Object.entries(variables)) {
    if (!value) {
      continue;
    }
    const pattern = new RegExp("\\$\\$" + variable + "\\$\\$", "g");
    code = code.replace(pattern, value);
  }
  return code;
}

/** @todo run once */
function readCode(path: string): Promise<string> {
  return fs.promises.readFile(path, "utf-8");
}

function contentToDelegate(
  schemaToDelegate: SchemaToDelegate,
  content: ContentObject
): { schema: SchemaObject; delegate: string } {
  const mediaType = content["application/json"];
  if (!mediaType.schema) {
    throw new Error("mediaType.schema must be defined");
  }
  const ref = mediaType.schema["$ref"];
  return schemaToDelegate[ref];
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

function getSchemaToDelegate(
  api: OpenAPIObject,
  client: PrismaClient
): SchemaToDelegate {
  const schemaToDelegate: SchemaToDelegate = {};
  if (!api?.components?.schemas) {
    throw new Error("api.components.schemas must be defined");
  }
  for (const [name, componentSchema] of Object.entries(
    api.components.schemas
  )) {
    const lowerCaseName = toLowerCaseName(name);
    if (lowerCaseName in client) {
      schemaToDelegate[SCHEMA_PREFIX + name] = {
        schema: componentSchema,
        delegate: lowerCaseName,
      };
      continue;
    }
    if ("type" in componentSchema && componentSchema.type === "array") {
      const { items } = componentSchema;
      if (items && "$ref" in items) {
        const itemsName = removeSchemaPrefix(items.$ref);
        const lowerCaseItemsName = toLowerCaseName(itemsName);
        if (lowerCaseItemsName in client) {
          schemaToDelegate[SCHEMA_PREFIX + name] = {
            schema: componentSchema,
            delegate: lowerCaseItemsName,
          };
          continue;
        }
      }
    }
  }
  return schemaToDelegate;
}

function removeExt(filePath: string): string {
  const parsedPath = path.parse(filePath);
  return path.join(parsedPath.dir, parsedPath.name);
}

function removeSchemaPrefix(ref: string): string {
  return ref.replace(SCHEMA_PREFIX, "");
}

function toLowerCaseName(name: string): string {
  return name[0].toLowerCase() + name.slice(1);
}

// Copied from https://github.com/isa-group/oas-tools/blob/5ee4506e4020671a11412d8d549da3e01c44c143/src/index.js
function getExpressVersion(oasPath: string): string {
  return oasPath.replace(/{/g, ":").replace(/}/g, "");
}
