import * as path from "path";
import { ParameterObject, SchemaObject, OpenAPIObject } from "openapi3-ts";
import { namedTypes, builders } from "ast-types";
import { resolveRef, removeSchemaPrefix } from "./open-api";
import { importNames } from "./ast";
import { removeExt } from "./module";

/**
 * Creates the params type for nest's controller Params decorated argument.
 * @param operation the OpenAPI Operation of the path parameters to use
 * @returns the new TypeScript object type as AST node
 */
export function createParamsType(
  parameters: ParameterObject[]
): namedTypes.TSTypeLiteral {
  const pathParameters = parameters.filter(
    (parameter) => parameter.in === "path"
  );
  return convertOpenAPIParametersToType(pathParameters);
}

/**
 * Creates the query type for nest's controller Query decorated argument.
 * @param operation the OpenAPI Operation of the query parameters to use
 * @returns the new TypeScript object type as AST node
 */
export function createQueryType(
  parameters: ParameterObject[]
): namedTypes.TSTypeLiteral {
  const queryParameters = parameters.filter(
    (parameter) => parameter.in === "query"
  );
  return convertOpenAPIParametersToType(queryParameters);
}

/**
 * Creates an object type from given parameters
 * @param parameters OpenAPI Operation parameters to use as the object fields
 * @returns the new TypeScript object type as AST node
 */
export function convertOpenAPIParametersToType(
  parameters: ParameterObject[]
): namedTypes.TSTypeLiteral {
  const paramsPropertySignatures = parameters.map((parameter) => {
    const { schema = { type: "string" } } = parameter;
    const { type } = schemaToType(schema);
    return builders.tsPropertySignature(
      builders.identifier(parameter.name),
      // @ts-ignore
      builders.tsTypeAnnotation(type)
    );
  });
  return builders.tsTypeLiteral(paramsPropertySignatures);
}

export function schemaToType(
  schema: SchemaObject
): { type: namedTypes.TSType; imports: namedTypes.ImportDeclaration[] } {
  if ("$ref" in schema) {
    const name = removeSchemaPrefix(schema.$ref);
    const id = builders.identifier(name);
    const itemModule = removeExt(getDTOPath(name));
    return {
      type: builders.tsTypeReference(id),
      imports: [importNames([id], itemModule)],
    };
  }
  switch (schema.type) {
    case "string": {
      return { type: builders.tsStringKeyword(), imports: [] };
    }
    case "number":
    case "integer": {
      return { type: builders.tsNumberKeyword(), imports: [] };
    }
    case "object": {
      if (!schema.properties) {
        throw new Error(
          "When schema.type is 'object' schema.properties must be defined"
        );
      }
      const propertySignatures = [];
      const imports = [];

      for (const [propertyName, property] of Object.entries(
        schema.properties
      )) {
        if ("$ref" in property) {
          throw new Error("Not implemented");
        }
        const id = builders.identifier(propertyName);
        const { type, imports: typeImports } = schemaToType(property);
        // @ts-ignore
        const typeAnnotation = builders.tsTypeAnnotation(type);
        const signature = builders.tsPropertySignature(id, typeAnnotation);
        if (!schema.required || !schema.required.includes(propertyName)) {
          signature.optional = true;
        }
        propertySignatures.push(signature);
        imports.push(...typeImports);
      }

      return { type: builders.tsTypeLiteral(propertySignatures), imports: [] };
    }
    case "array": {
      if (!schema.items) {
        throw new Error(
          "When schema.type is 'array' schema.properties must be defined"
        );
      }
      const item = schemaToType(schema.items);
      return {
        // @ts-ignore
        type: builders.tsArrayType(item.type),
        imports: item.imports,
      };
    }
    default: {
      throw new Error("Not implemented");
    }
  }
}

export function getDTOPath(name: string) {
  return path.join("dto", `${name}.ts`);
}
