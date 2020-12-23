import { builders, namedTypes } from "ast-types";
import { Entity } from "../../../../../types";
import { readFile } from "../../../../../util/module";
import {
  interpolate,
  NamedClassDeclaration,
  removeTSClassDeclares,
  getClassDeclarationById,
} from "../../../../../util/ast";
import { isInputType } from "../../nestjs-graphql.util";

const templatePath = require.resolve("./update-args.template.ts");

export async function createUpdateArgs(
  entity: Entity,
  whereUniqueInput: NamedClassDeclaration,
  updateInput: NamedClassDeclaration
): Promise<NamedClassDeclaration | null> {
  const file = await readFile(templatePath);
  const id = createUpdateArgsId(entity.name);

  interpolate(file, {
    ID: id,
    WHERE_UNIQUE_INPUT: whereUniqueInput.id,
    UPDATE_INPUT: updateInput.id,
  });

  const classDeclaration = getClassDeclarationById(file, id);

  if (!isInputType(updateInput)) {
    return null;
  }

  removeTSClassDeclares(file);

  return classDeclaration as NamedClassDeclaration;
}

export function createUpdateArgsId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`Update${entityType}Args`);
}
