import { builders, namedTypes } from "ast-types";
import { Entity, NamedClassDeclaration } from "@amplication/code-gen-types";
import { readFile, removeTSClassDeclares } from "@amplication/code-gen-utils";
import { interpolate, getClassDeclarationById } from "../../../../../utils/ast";
import { isInputType } from "../../nestjs-graphql.util";

const templatePath = require.resolve("./create-args.template.ts");

export async function createCreateArgs(
  entity: Entity,
  createInput: NamedClassDeclaration
): Promise<NamedClassDeclaration | null> {
  const file = await readFile(templatePath);
  const id = createCreateArgsId(entity.name);

  interpolate(file, {
    ID: id,
    CREATE_INPUT: createInput.id,
  });

  const classDeclaration = getClassDeclarationById(file, id);

  if (!isInputType(createInput)) {
    return null;
  }

  removeTSClassDeclares(file);

  return classDeclaration as NamedClassDeclaration;
}

export function createCreateArgsId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`Create${entityType}Args`);
}
