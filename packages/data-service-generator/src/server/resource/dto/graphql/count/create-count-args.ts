import { builders, namedTypes } from "ast-types";
import { Entity, NamedClassDeclaration } from "@amplication/code-gen-types";
import { readFile, removeTSClassDeclares } from "@amplication/code-gen-utils";
import { interpolate, getClassDeclarationById } from "../../../../../utils/ast";

const templatePath = require.resolve("./count-args.template.ts");

export async function createCountArgs(
  entity: Entity,
  whereInput: NamedClassDeclaration
): Promise<NamedClassDeclaration> {
  const file = await readFile(templatePath);
  const id = createCountArgsId(entity.name);

  interpolate(file, {
    ID: id,
    WHERE_INPUT: whereInput.id,
  });

  removeTSClassDeclares(file);

  return getClassDeclarationById(file, id) as NamedClassDeclaration;
}

export function createCountArgsId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`${entityType}CountArgs`);
}
