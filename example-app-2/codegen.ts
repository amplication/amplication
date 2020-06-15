import * as fs from "fs";
import {
  OpenAPIObject,
  OperationObject,
  SchemaObject,
  ContentObject,
} from "openapi3-ts";
import * as prettier from "prettier";
import { PrismaClient } from "@prisma/client";

const SCHEMA_PREFIX = "#/components/schemas/";

type Method = "get" | "post" | "patch" | "put" | "delete";

export async function codegen(api: OpenAPIObject, client: PrismaClient) {
  let code = "";
  code += `
import express = require('express');
import { PrismaClient } from "@prisma/client";

const app = express();
const client = new PrismaClient();

`;
  for (const handler of registerEntityService(api, client)) {
    code += handler;
  }
  await fs.promises.writeFile(
    "generated.ts",
    prettier.format(code, { parser: "typescript" }),
    "utf-8"
  );
}

function* registerEntityService<T>(
  api: OpenAPIObject,
  client: PrismaClient
): Generator<string> {
  const schemaToDelegate = getSchemaToDelegate(api, client);
  for (const [path, pathSpec] of Object.entries(api.paths)) {
    for (const [method, operationSpec] of Object.entries(pathSpec)) {
      const expressPath = getExpressVersion(path);
      const handler = getHandler(
        method as Method,
        operationSpec as OperationObject,
        schemaToDelegate
      );
      yield `app.${method}("${expressPath}", ${handler});

      `;
    }
  }
}

function getHandler(
  method: Method,
  operation: OperationObject,
  schemaToDelegate: {
    [key: string]: {
      schema: SchemaObject;
    };
  }
) {
  switch (method) {
    case "get": {
      const response = operation.responses["200"];
      const { delegate, schema } = contentToDelegate(
        schemaToDelegate,
        response.content
      );
      switch (schema.type) {
        case "object": {
          return `
async (req, res) => {
    await client.connect();
    try {
        /** @todo smarter parameters to prisma args */
        const result = await ${delegate}.findOne({
            where: req.params,
        });
        res.end(JSON.stringify(result));
    } catch (error) {
        console.error(error);
        res.status(500).end();
    } finally {
        await client.disconnect();
    }
}
            `;
        }
        case "array": {
          return `
async (req, res) => {
    await client.connect();
    try {
        /** @todo smarter parameters to prisma args */
        const results = await ${delegate}.findMany({
            where: req.params,
        });
        res.end(JSON.stringify(results));
    } catch (error) {
        console.error(error);
        res.status(500).end();
    } finally {
        await client.disconnect();
    }
}
            `;
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
      return `
async (req, res) => {
    await client.connect();
    try {
        /** @todo request body to prisma args */
        await ${delegate}.create(req.body);
        res.status(201).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    } finally {
        await client.disconnect();
    }
}
            `;
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
