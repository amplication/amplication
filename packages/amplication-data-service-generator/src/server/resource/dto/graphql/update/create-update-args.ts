import { builders, namedTypes } from "ast-types";
import { Entity } from "../../../../../types";
import { readFile } from "../../../../../util/module";
import {
  interpolate,
  NamedClassDeclaration,
  removeTSClassDeclares,
  getClassDeclarationById,
  deleteClassPropertyById,
} from "../../../../../util/ast";
import { isInputType } from "../../nestjs-graphql.util";

const DATA_ID = builders.identifier("data");
const templatePath = require.resolve("./update-args.template.ts");

export async function createUpdateArgs(
  entity: Entity,
  whereUniqueInput: NamedClassDeclaration,
  updateInput: NamedClassDeclaration
): Promise<NamedClassDeclaration> {
  const file = await readFile(templatePath);
  const id = createId(entity.name);

  interpolate(file, {
    ID: id,
    WHERE_UNIQUE_INPUT: whereUniqueInput.id,
    UPDATE_INPUT: updateInput.id,
  });

  const classDeclaration = getClassDeclarationById(file, id);

  if (!isInputType(updateInput)) {
    deleteClassPropertyById(classDeclaration, DATA_ID);
  }

  removeTSClassDeclares(file);

  return classDeclaration as NamedClassDeclaration;
}

export function createId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`Update${entityType}Args`);
}
