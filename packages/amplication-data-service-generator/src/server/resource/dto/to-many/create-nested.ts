import { builders, namedTypes } from "ast-types";
import { classDeclaration, NamedClassDeclaration } from "../../../../util/ast";
import { Entity, EntityField } from "../../../../types";
import { INPUT_TYPE_DECORATOR } from "../nestjs-graphql.util";
import { createCreateNestedManyProperties } from "./connectOrCreateClassBody";

export function createNestedInputDTO(
  classId: namedTypes.Identifier,
  entity: Entity,
  toManyField: EntityField
): NamedClassDeclaration {
  const properties = createCreateNestedManyProperties(toManyField, entity);
  const decorators = properties.length ? [INPUT_TYPE_DECORATOR] : [];
  return classDeclaration(
    classId,
    builders.classBody(properties),
    null,
    decorators
  ) as NamedClassDeclaration;
}
