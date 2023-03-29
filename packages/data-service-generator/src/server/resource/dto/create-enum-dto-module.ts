import { namedTypes, builders } from "ast-types";
import { print } from "@amplication/code-gen-utils";
import { Module } from "@amplication/code-gen-types";
import {
  addAutoGenerationComment,
  addImports,
  expressionStatement,
  importDeclaration,
} from "../../../utils/ast";
import { createDTOFile } from "./create-dto-module";
import { logger } from "../../../logging";

const REGISTER_ENUM_TYPE_ID = builders.identifier("registerEnumType");

export function createEnumDTOModule(
  dto: namedTypes.TSEnumDeclaration,
  dtoNameToPath: Record<string, string>
): Module {
  try {
    const file = createDTOFile(dto, dtoNameToPath[dto.id.name], dtoNameToPath);

    file.program.body
      .push(expressionStatement`${REGISTER_ENUM_TYPE_ID}(${dto.id}, {
    name: "${dto.id.name}",
  });`);

    addImports(file, [
      importDeclaration`import { ${REGISTER_ENUM_TYPE_ID} } from "@nestjs/graphql"`,
    ]);
    addAutoGenerationComment(file);

    return {
      code: print(file).code,
      path: dtoNameToPath[dto.id.name],
    };
  } catch (error) {
    logger.info(error);
    throw error;
  }
}
