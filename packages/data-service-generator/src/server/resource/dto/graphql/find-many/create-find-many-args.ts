import { interpolate, getClassDeclarationById } from "../../../../../utils/ast";
import { Entity, NamedClassDeclaration } from "@amplication/code-gen-types";
import { readFile, removeTSClassDeclares } from "@amplication/code-gen-utils";
import { builders, namedTypes } from "ast-types";

const templatePath = require.resolve("./find-many-args.template.ts");

export async function createFindManyArgs(
  entity: Entity,
  whereInput: NamedClassDeclaration,
  orderByInput: NamedClassDeclaration
): Promise<NamedClassDeclaration> {
  const file = await readFile(templatePath);
  const id = createFindManyArgsId(entity.name);

  interpolate(file, {
    ID: id,
    WHERE_INPUT: whereInput.id,
    ORDER_BY_INPUT: orderByInput.id,
  });

  removeTSClassDeclares(file);

  return getClassDeclarationById(file, id) as NamedClassDeclaration;
}

export function createFindManyArgsId(
  entityType: string
): namedTypes.Identifier {
  return builders.identifier(`${entityType}FindManyArgs`);
}
