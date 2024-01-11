import { interpolate, getClassDeclarationById } from "../../../../../utils/ast";
import { Entity, NamedClassDeclaration } from "@amplication/code-gen-types";
import { readFile, removeTSClassDeclares } from "@amplication/code-gen-utils";
import { builders, namedTypes } from "ast-types";

const templatePath = require.resolve("./find-one-args.template.ts");

export async function createFindOneArgs(
  entity: Entity,
  whereUniqueInput: NamedClassDeclaration
): Promise<NamedClassDeclaration> {
  const file = await readFile(templatePath);
  const id = createFindOneArgsId(entity.name);

  interpolate(file, {
    ID: id,
    WHERE_UNIQUE_INPUT: whereUniqueInput.id,
  });

  removeTSClassDeclares(file);

  return getClassDeclarationById(file, id) as NamedClassDeclaration;
}

export function createFindOneArgsId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`${entityType}FindUniqueArgs`);
}
