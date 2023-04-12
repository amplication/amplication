import { namedTypes, builders } from "ast-types";
import { Entity, NamedClassDeclaration } from "@amplication/code-gen-types";
import { readFile, removeTSClassDeclares } from "@amplication/code-gen-utils";
import { getClassDeclarationById, interpolate } from "../../../../../utils/ast";

const templatePath = require.resolve(
  "./entity-list-relation-filter.template.ts"
);

export async function createEntityListRelationFilter(
  entity: Entity,
  whereInput: NamedClassDeclaration
): Promise<NamedClassDeclaration> {
  const file = await readFile(templatePath);
  const id = createEntityListRelationFilterID(entity.name);

  interpolate(file, {
    ID: id,
    WHERE_INPUT: whereInput.id,
  });

  removeTSClassDeclares(file);

  return getClassDeclarationById(file, id) as NamedClassDeclaration;
}

export function createEntityListRelationFilterID(
  entityType: string
): namedTypes.Identifier {
  return builders.identifier(`${entityType}ListRelationFilter`);
}
