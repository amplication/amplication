import * as path from "path";
import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import { SchemaObject, OpenAPIObject } from "openapi3-ts";
import { removeSchemaPrefix } from "./util/open-api";
import { Module } from "./util/module";

export function createDTOModules(api: OpenAPIObject): Module[] {
  if (!api?.components?.schemas) {
    return [];
  }
  return Object.entries(api.components.schemas).map(([name, schema]) =>
    schemaToModule(schema, name)
  );
}

function schemaToModule(schema: SchemaObject, name: string): Module {
  const { type, imports } = schemaToType(schema);
  const id = builders.identifier(name);
  const program = builders.program([
    ...imports,
    // @ts-ignore
    builders.exportNamedDeclaration(builders.tsTypeAliasDeclaration(id, type), [
      builders.exportSpecifier(id, id),
    ]),
  ]);
  return {
    code: print(program).code,
    path: path.join("dto", `${name}.ts`),
  };
}

function schemaToType(
  schema: SchemaObject
): { type: namedTypes.TSType; imports: namedTypes.ImportDeclaration[] } {
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
      if (!("$ref" in schema.items)) {
        throw new Error("Not implemented");
      }
      const item = removeSchemaPrefix(schema.items.$ref);
      const itemId = builders.identifier(item);
      const itemModule = `./${item}`;
      return {
        type: builders.tsArrayType(builders.tsTypeReference(itemId)),
        imports: [
          builders.importDeclaration(
            [builders.importSpecifier(itemId)],
            builders.stringLiteral(itemModule)
          ),
        ],
      };
    }
    default: {
      throw new Error("Not implemented");
    }
  }
}
