import {
  OperationObject,
  ParameterObject,
  SchemaObject,
  OpenAPIObject,
} from "openapi3-ts";
import { namedTypes, builders } from "ast-types";
import { resolveRef } from "./open-api";

/**
 * Creates the params type for nest's controller Params decorated argument.
 * @param operation the OpenAPI Operation of the path parameters to use
 * @returns the new TypeScript object type as AST node
 */
export function createParamsType(
  operation: OperationObject
): namedTypes.TSTypeLiteral {
  if (!operation.parameters) {
    throw new Error("operation.parameters must be defined");
  }
  const pathParameters = operation.parameters.filter(
    (parameter): parameter is ParameterObject =>
      "in" in parameter && parameter.in === "path"
  );
  return convertOpenAPIParametersToType(pathParameters);
}

/**
 * Creates the query type for nest's controller Query decorated argument.
 * @param operation the OpenAPI Operation of the query parameters to use
 * @returns the new TypeScript object type as AST node
 */
export function createQueryType(
  operation: OperationObject
): namedTypes.TSTypeLiteral {
  if (!operation.parameters) {
    throw new Error("operation.parameters must be defined");
  }
  const queryParameters = operation.parameters.filter(
    (parameter): parameter is ParameterObject =>
      "in" in parameter && parameter.in === "query"
  );
  return convertOpenAPIParametersToType(queryParameters);
}

/**
 * Creates an object type from given parameters
 * @param parameters OpenAPI Operation parameters to use as the object fields
 * @returns the new TypeScript object type as AST node
 */
function convertOpenAPIParametersToType(
  parameters: ParameterObject[]
): namedTypes.TSTypeLiteral {
  const paramsPropertySignatures = parameters.map((parameter) =>
    builders.tsPropertySignature(
      builders.identifier(parameter.name),
      /** @todo get type from swagger */
      builders.tsTypeAnnotation(builders.tsStringKeyword())
    )
  );
  return builders.tsTypeLiteral(paramsPropertySignatures);
}

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
