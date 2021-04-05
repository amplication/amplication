import { builders, namedTypes } from "ast-types";
import { Entity } from "../../../../../types";
import { readFile } from "../../../../../util/module";
import {
  interpolate,
  NamedClassDeclaration,
  removeTSClassDeclares,
  getClassDeclarationById,
} from "../../../../../util/ast";

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
