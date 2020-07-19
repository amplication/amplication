import * as t from "@babel/types";
import * as path from "path";
import { SchemaObject, OpenAPIObject } from "openapi3-ts";
import generate from "@babel/generator";
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
  const id = t.identifier(name);
  const program = t.program([
    ...imports,
    t.exportNamedDeclaration(t.tsTypeAliasDeclaration(id, null, type), [
      t.exportSpecifier(id, id),
    ]),
  ]);
  return {
    code: generate(program).code,
    path: path.join("dto", `${name}.ts`),
  };
}

function schemaToType(
  schema: SchemaObject
): { type: t.TSType; imports: t.ImportDeclaration[] } {
  switch (schema.type) {
    case "string": {
      return { type: t.tsStringKeyword(), imports: [] };
    }
    case "number":
    case "integer": {
      return { type: t.tsNumberKeyword(), imports: [] };
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
        const id = t.identifier(propertyName);
        const { type, imports: typeImports } = schemaToType(property);
        const typeAnnotation = t.tsTypeAnnotation(type);
        const signature = t.tsPropertySignature(id, typeAnnotation);
        if (!schema.required || !schema.required.includes(propertyName)) {
          signature.optional = true;
        }
        propertySignatures.push(signature);
        imports.push(...typeImports);
      }

      return { type: t.tsTypeLiteral(propertySignatures), imports: [] };
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
      const itemId = t.identifier(item);
      const itemModule = `./${item}`;
      return {
        type: t.tsArrayType(t.tsTypeReference(itemId)),
        imports: [
          t.importDeclaration(
            [t.importSpecifier(itemId, itemId)],
            t.stringLiteral(itemModule)
          ),
        ],
      };
    }
    default: {
      throw new Error("Not implemented");
    }
  }
}
