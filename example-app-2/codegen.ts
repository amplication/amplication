import * as fs from "fs";
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

const SCHEMA_PREFIX = "#/components/schemas/";

type Method = "get" | "post" | "patch" | "put" | "delete";

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

function readCode(path: string): Promise<string> {
  return fs.promises.readFile(path, "utf-8");
}

export async function codegen(apis: OpenAPIObject[], client: PrismaClient) {
  await fs.promises.rmdir("dist", {
    recursive: true,
  });
  await fs.promises.mkdir("dist");
  const appTemplate = await readCode(appTemplatePath);
  let imports = "";
  let uses = "";
  for (const api of apis) {
    const moduleName = paramCase(api.info.title);
    const namespace = camelCase(api.info.title);
    const filePath = `dist/${moduleName}.ts`;
    const modulePath = `./${moduleName}`;
    imports += `import * as ${namespace} from "${modulePath}"`;
    uses += `app.use(${namespace}.router)`;
    const code = await generateRouter(api, client);
    await fs.promises.writeFile(
      filePath,
      prettier.format(code, { parser: "typescript" }),
      "utf-8"
    );
  }
  const code = `
  ${imports}
  ${appTemplate}
  ${uses}
  `;
  await fs.promises.writeFile(
    "dist/index.ts",
    prettier.format(code, { parser: "typescript" }),
    "utf-8"
  );
  await fs.promises.copyFile("templates/prisma.ts", "dist/prisma.ts");
}

async function generateRouter(api: OpenAPIObject, client: PrismaClient) {
  return `
import express = require("express");
import { client } from "./prisma";

export const router = express.Router();

${await registerEntityService(api, client)}
`;
}

async function registerEntityService<T>(
  api: OpenAPIObject,
  client: PrismaClient
): Promise<string> {
  let code = "";
  const schemaToDelegate = getSchemaToDelegate(api, client);
  for (const [path, pathSpec] of Object.entries(api.paths)) {
    for (const [method, operationSpec] of Object.entries(pathSpec)) {
      const handler = await getHandler(
        method as Method,
        path,
        operationSpec as OperationObject,
        schemaToDelegate
      );
      code += handler + "\n\n";
    }
  }
  return code;
}

async function getHandler(
  method: Method,
  path: string,
  operation: OperationObject,
  schemaToDelegate: {
    [key: string]: {
      schema: SchemaObject;
    };
  }
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
          return code
            .replace("$$COMMENT", operation.summary)
            .replace("$$PATH", expressPath)
            .replace("$$DELEGATE", delegate);
        }
        case "array": {
          const code = await readCode(findManyHandlerTemplatePath);
          return code
            .replace("$$COMMENT", operation.summary)
            .replace("$$PATH", expressPath)
            .replace("$$DELEGATE", delegate);
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
      return code
        .replace("$$COMMENT", operation.summary)
        .replace("$$PATH", expressPath)
        .replace("$$DELEGATE", delegate);
    }
  }
}

function contentToDelegate(schemaToDelegate, content: ContentObject) {
  const mediaType = content["application/json"];
  const ref = mediaType.schema["$ref"];
  return schemaToDelegate[ref];
}

function getSchemaToDelegate(api: OpenAPIObject, client: PrismaClient) {
  const schemaToDelegate = {};
  for (const [name, componentSchema] of Object.entries(
    api.components.schemas
  )) {
    const lowerCaseName = toLowerCaseName(name);
    if (lowerCaseName in client) {
      schemaToDelegate[SCHEMA_PREFIX + name] = {
        schema: componentSchema,
        delegate: `client.${lowerCaseName}`,
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
            delegate: `client.${lowerCaseItemsName}`,
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
