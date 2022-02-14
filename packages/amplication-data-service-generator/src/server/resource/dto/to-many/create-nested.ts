import { builders, namedTypes } from "ast-types";
import { Entity, EntityField } from "../../../../types";
import { classDeclaration, NamedClassDeclaration } from "../../../../util/ast";
import { INPUT_TYPE_DECORATOR } from "../nestjs-graphql.util";
import { createNestedManyProperties } from "./nestedManyProperties";

export function createNestedInputDTO(
  classId: namedTypes.Identifier,
  entity: Entity,
  toManyField: EntityField
): NamedClassDeclaration {
  const properties = createNestedManyProperties(toManyField, entity);
  const decorators = properties.length ? [INPUT_TYPE_DECORATOR] : [];
  return classDeclaration(
    classId,
    builders.classBody(properties),
    null,
    decorators
  ) as NamedClassDeclaration;
}
