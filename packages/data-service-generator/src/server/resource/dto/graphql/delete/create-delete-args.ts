import { builders, namedTypes } from "ast-types";
import { Entity, NamedClassDeclaration } from "@amplication/code-gen-types";
import { readFile, removeTSClassDeclares } from "@amplication/code-gen-utils";
import { interpolate, getClassDeclarationById } from "../../../../../utils/ast";

const templatePath = require.resolve("./delete-args.template.ts");

export async function createDeleteArgs(
  entity: Entity,
  whereUniqueInput: NamedClassDeclaration
): Promise<NamedClassDeclaration> {
  const file = await readFile(templatePath);
  const id = createDeleteArgsId(entity.name);

  interpolate(file, {
    ID: id,
    WHERE_UNIQUE_INPUT: whereUniqueInput.id,
  });

  removeTSClassDeclares(file);

  return getClassDeclarationById(file, id) as NamedClassDeclaration;
}

export function createDeleteArgsId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`Delete${entityType}Args`);
}
