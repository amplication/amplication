import { namedTypes, builders } from "ast-types";
import { print } from "recast";
import { Module } from "../../../types";
import {
  addImports,
  expressionStatement,
  importDeclaration,
} from "../../../util/ast";
import { createDTOFile } from "./create-dto-module";

const REGISTER_ENUM_TYPE_ID = builders.identifier("registerEnumType");

export function createEnumDTOModule(
  dto: namedTypes.TSEnumDeclaration,
  dtoNameToPath: Record<string, string>
): Module {
  const file = createDTOFile(dto, dtoNameToPath[dto.id.name], dtoNameToPath);

  file.program.body
    .push(expressionStatement`${REGISTER_ENUM_TYPE_ID}(${dto.id}, {
  name: "${dto.id.name}",
});`);

  addImports(file, [
    importDeclaration`import { ${REGISTER_ENUM_TYPE_ID} } from "@nestjs/graphql"`,
  ]);

  return {
    code: print(file).code,
    path: dtoNameToPath[dto.id.name],
  };
}
