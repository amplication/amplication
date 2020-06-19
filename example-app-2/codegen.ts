import * as fs from "fs";
import * as path from "path";
import {
  OpenAPIObject,
  OperationObject,
  SchemaObject,
  ContentObject,
} from "openapi3-ts";
import { camelCase } from "camel-case";
import { paramCase } from "param-case";
import * as prettier from "prettier";
import { PrismaClient } from "@prisma/client";
import flatten = require("lodash.flatten");

const SCHEMA_PREFIX = "#/components/schemas/";
const OUTPUT_DIRECTORY = "dist";

type Method = "get" | "post" | "patch" | "put" | "delete";

type SchemaToDelegate = {
  [key: string]: {
    schema: SchemaObject;
  };
};

const appTemplatePath = require.resolve("./templates/app.ts");
const findOneHandlerTemplatePath = require.resolve(
  "./templates/find-one-handler.ts"
);
const createHandlerTemplatePath = require.resolve(
  "./templates/create-handler.ts"
);
const findManyHandlerTemplatePath = require.resolve(
  "./templates/find-many-handler.ts"
);
const routerTemplatePath = require.resolve("./templates/router.ts");
const prismaTemplatePath = require.resolve("./templates/prisma.ts");

type Module = {
  path: string;
  code: string;
};

type ImportableModule = Module & {
  namespace: string;
  importPath: string;
};

export async function codegen(apis: OpenAPIObject[], client: PrismaClient) {
  const routerModuleLists = await Promise.all(
    apis.map((api) => generateResource(api, client))
  );
  const routerModules = flatten(routerModuleLists);
  const indexModule = await createIndexModule(routerModules);

  const modules = [...routerModules, indexModule];

  writeModules(modules);
}

async function createIndexModule(
  routerModules: ImportableModule[]
): Promise<Module> {
  const appTemplate = await readCode(appTemplatePath);
  return {
    path: "index.ts",
    code: interpolate(appTemplate, {
      $$IMPORTS: routerModules.map(importModuleAsNamespace).join("\n"),
      $$MIDDLEWARES: routerModules.map(useModuleExpressRouter).join("\n"),
    }),
  };
}

function importModuleAsNamespace(module: ImportableModule): string {
  return `import * as ${module.namespace} from "${module.importPath}";`;
}

function useModuleExpressRouter(module: ImportableModule): string {
  return `app.use(${module.namespace}.router);`;
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

  await fs.promises.copyFile(
    prismaTemplatePath,
    path.join(OUTPUT_DIRECTORY, "prisma.ts")
  );
}

async function generateResource(
  api: OpenAPIObject,
  client: PrismaClient
): Promise<ImportableModule[]> {
  const code = await readCode(routerTemplatePath);
  const handlers = [];
  const schemaToDelegate = getSchemaToDelegate(api, client);
  for (const [path, pathSpec] of Object.entries(api.paths)) {
    for (const [method, operationSpec] of Object.entries(pathSpec)) {
      const handler = await getHandler(
        method as Method,
        path,
        operationSpec as OperationObject,
        schemaToDelegate
      );
      handlers.push(handler);
    }
  }
  const moduleName = paramCase(api.info.title);
  return [
    {
      namespace: camelCase(api.info.title),
      path: `${moduleName}.ts`,
      importPath: `./${moduleName}`,
      code: interpolate(code, {
        $$HANDLERS: handlers.join("\n\n"),
      }),
    },
  ];
}

async function getHandler(
  method: Method,
  path: string,
  operation: OperationObject,
  schemaToDelegate: SchemaToDelegate
) {
  const expressPath = getExpressVersion(path);
  switch (method) {
    case "get": {
      const response = operation.responses["200"];
      const { delegate, schema } = contentToDelegate(
        schemaToDelegate,
        response.content
      );
      switch (schema.type) {
        case "object": {
          const code = await readCode(findOneHandlerTemplatePath);
          return interpolate(code, {
            $$COMMENT: operation.summary,
            $$PATH: expressPath,
            $$DELEGATE: delegate,
          });
        }
        case "array": {
          const code = await readCode(findManyHandlerTemplatePath);
          return interpolate(code, {
            $$COMMENT: operation.summary,
            $$PATH: expressPath,
            $$DELEGATE: delegate,
          });
        }
      }
    }
    case "post": {
      if (!("content" in operation.requestBody)) {
        throw new Error();
      }
      const { delegate } = contentToDelegate(
        schemaToDelegate,
        operation.requestBody.content
      );
      const code = await readCode(createHandlerTemplatePath);
      return interpolate(code, {
        $$COMMENT: operation.summary,
        $$PATH: expressPath,
        $$DELEGATE: delegate,
      });
    }
  }
}

function interpolate(code: string, variables: { [variable: string]: string }) {
  for (const [variable, value] of Object.entries(variables)) {
    code = code.replace(variable, value);
  }
  return code;
}

/** @todo run once */
function readCode(path: string): Promise<string> {
  return fs.promises.readFile(path, "utf-8");
}

function contentToDelegate(schemaToDelegate, content: ContentObject) {
  const mediaType = content["application/json"];
  const ref = mediaType.schema["$ref"];
  return schemaToDelegate[ref];
}

function getSchemaToDelegate(
  api: OpenAPIObject,
  client: PrismaClient
): SchemaToDelegate {
  const schemaToDelegate = {};
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
      if ("$ref" in items) {
        const itemsName = items.$ref.replace(SCHEMA_PREFIX, "");
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

function toLowerCaseName(name: string): string {
  return name[0].toLowerCase() + name.slice(1);
}

// Copied from https://github.com/isa-group/oas-tools/blob/5ee4506e4020671a11412d8d549da3e01c44c143/src/index.js
function getExpressVersion(oasPath) {
  return oasPath.replace(/{/g, ":").replace(/}/g, "");
}
