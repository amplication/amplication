import * as path from "path";
import { print } from "recast";
import { builders } from "ast-types";
import { SchemaObject, OpenAPIObject } from "openapi3-ts";
import { Module } from "./util/module";
import { relativeImportDeclaration } from "./util/ast";
import { schemaToType, getDTOPath } from "./util/open-api-code-generation";

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
  const modulePath = getDTOPath(name);
  const program = builders.program([
    ...imports.map((declaration) =>
      relativeImportDeclaration(modulePath, declaration)
    ),
    // @ts-ignore
    builders.exportNamedDeclaration(builders.tsTypeAliasDeclaration(id, type), [
      builders.exportSpecifier(id, id),
    ]),
  ]);
  return {
    code: print(program).code,
    path: modulePath,
  };
}
