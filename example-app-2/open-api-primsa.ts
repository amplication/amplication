/**
 * Integration of OpenAPI with Prisma
 */

import { OpenAPIObject } from "openapi3-ts";
import { PrismaClient } from "@prisma/client";
import { prefixSchema, removeSchemaPrefix } from "./open-api.util";
import { toLowerCaseName } from "./string.util";

export type SchemaToDelegate = {
  [key: string]: string;
};

/**
 * Returns a mapping between OpenAPI schemas to their matching Prisma delegates
 * @param api OpenAPI configuration
 * @param prismaClient initialized client of Prisma
 */
export function getSchemaToDelegate(
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
