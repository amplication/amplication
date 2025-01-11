import { namedTypes, builders } from "ast-types";
import { print } from "@amplication/code-gen-utils";
import { Module, NamedClassDeclaration } from "@amplication/code-gen-types";
import {
  addAutoGenerationComment,
  addImports,
  expressionStatement,
  importDeclaration,
} from "../../../utils/ast";
import { createDTOFile } from "./create-dto-module";
import { logger } from "@amplication/dsg-utils";

const REGISTER_ENUM_TYPE_ID = builders.identifier("registerEnumType");

export function createEnumDTOModule(
  dto: NamedClassDeclaration | namedTypes.TSEnumDeclaration,
  dtoNameToPath: Record<string, string>,
  dtoPath: string = undefined,
  shouldAddAutoGenerationComment = true
): Module {
  try {
    const path = dtoPath || dtoNameToPath[dto.id.name];
    const file = createDTOFile(dto, path, dtoNameToPath);

    file.program.body
      .push(expressionStatement`${REGISTER_ENUM_TYPE_ID}(${dto.id}, {
    name: "${dto.id.name}",
  });`);

    addImports(file, [
      importDeclaration`import { ${REGISTER_ENUM_TYPE_ID} } from "@nestjs/graphql"`,
    ]);
    shouldAddAutoGenerationComment && addAutoGenerationComment(file);

    return {
      code: print(file).code,
      path: dtoNameToPath[dto.id.name],
    };
  } catch (error) {
    logger.info(error);
    throw error;
  }
}
