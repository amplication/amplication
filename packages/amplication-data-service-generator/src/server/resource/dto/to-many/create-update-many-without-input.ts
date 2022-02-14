import { builders, namedTypes } from "ast-types";
import { pascalCase } from "pascal-case";
import { Entity, EntityField } from "../../../../types";
import { classDeclaration, NamedClassDeclaration } from "../../../../util/ast";
import { isToManyRelationField } from "../../../../util/field";
import { INPUT_TYPE_DECORATOR } from "../nestjs-graphql.util";
import { createCreateNestedManyProperties } from "./connectOrCreateClassBody";

export function createUpdateManyWithoutInputDTOs(
  entity: Entity
): NamedClassDeclaration[] {
  const toManyFields = entity.fields.filter(isToManyRelationField);
  const createNestedManyWithoutInputDtos = toManyFields.map((field) =>
    createUpdateManyWithoutInputDTO(entity, field)
  );
  return createNestedManyWithoutInputDtos;
}

export function createUpdateManyWithoutInputDTO(
  entity: Entity,
  toManyField: EntityField
): NamedClassDeclaration {
  const properties = createCreateNestedManyProperties(toManyField, entity);
  const decorators = properties.length ? [INPUT_TYPE_DECORATOR] : [];
  return classDeclaration(
    createUpdateManyWithoutInputID(
      entity.pluralDisplayName,
      toManyField.properties.relatedEntity.name
    ),
    builders.classBody(properties),
    null,
    decorators
  ) as NamedClassDeclaration;
}

export function createUpdateManyWithoutInputID(
  pluralEntityName: string,
  nestedEntityName: string
): namedTypes.Identifier {
  return builders.identifier(
    `${pascalCase(nestedEntityName)}UpdateManyWithout${pascalCase(
      pluralEntityName
    )}Input`
  );
}
