import { SchemaObject, OpenAPIObject } from "openapi3-ts";
import { namedTypes, builders } from "ast-types";
import { resolveRef } from "./util/open-api";

export function createTestData(
  api: OpenAPIObject,
  schema: SchemaObject,
  name: string | null = null
):
  | namedTypes.StringLiteral
  | namedTypes.NumericLiteral
  | namedTypes.ObjectExpression
  | namedTypes.ArrayExpression {
  if ("$ref" in schema) {
    const resolved = resolveRef(api, schema["$ref"]);
    return createTestData(api, resolved, name);
  }
  switch (schema.type) {
    case "string":
      if (schema.format === "email") {
        return builders.stringLiteral(`alice@example.com`);
      }
      return builders.stringLiteral(`Example ${name || "string"}`);
    case "object":
      if (!schema.properties) {
        return builders.objectExpression([]);
      }
      return builders.objectExpression(
        Object.entries(schema.properties).map(([key, value]) =>
          builders.objectProperty(
            builders.identifier(key),
            createTestData(api, value, key)
          )
        )
      );
    case "number": {
      return builders.numericLiteral(42);
    }
    case "array": {
      if (!schema.items) {
        return builders.arrayExpression([]);
      }
      return builders.arrayExpression([createTestData(api, schema.items)]);
    }
    default: {
      throw new Error(`Not implemented for ${JSON.stringify(schema)}`);
    }
  }
}
