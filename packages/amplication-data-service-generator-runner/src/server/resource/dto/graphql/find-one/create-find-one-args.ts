import { builders, namedTypes } from "ast-types";
import { Entity, NamedClassDeclaration } from "@amplication/code-gen-types";
import { readFile } from "@amplication/code-gen-utils";
import {
  interpolate,
  removeTSClassDeclares,
  getClassDeclarationById,
} from "../../../../../utils/ast";

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
