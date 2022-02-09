import { builders, namedTypes } from "ast-types";
import { pascalCase } from "pascal-case";
import { Entity, EntityField } from "../../../../types";
import { classDeclaration, NamedClassDeclaration } from "../../../../util/ast";
import { isToManyRelationField } from "../../../../util/field";
import { INPUT_TYPE_DECORATOR } from "../nestjs-graphql.util";
import { createCreateNestedManyProperties } from "./connectOrCreateClassBody";

export function createCreateNestedManyDTOs(
  entity: Entity
): NamedClassDeclaration[] {
  const toManyFields = entity.fields.filter(isToManyRelationField);
  if (toManyFields.length > 0) {
    const createNestedManyWithoutInputDtos = toManyFields.map((field) =>
      createCreateNestedManyDTO(entity, field)
    );
    return createNestedManyWithoutInputDtos;
  }
  return [];
}

export function createCreateNestedManyDTO(
  entity: Entity,
  toManyField: EntityField
): NamedClassDeclaration {
  const properties = createCreateNestedManyProperties(toManyField, entity);
  const decorators = properties.length ? [INPUT_TYPE_DECORATOR] : [];
  return classDeclaration(
    createCreateNestedManyWithoutInputID(
      entity.pluralDisplayName,
      toManyField.properties.relatedEntity.name
    ),
    builders.classBody(properties),
    null,
    decorators
  ) as NamedClassDeclaration;
}

export function createCreateNestedManyWithoutInputID(
  pluralEntityName: string,
  nestedEntityName: string
): namedTypes.Identifier {
  return builders.identifier(
    `${pascalCase(nestedEntityName)}CreateNestedManyWithout${pascalCase(
      pluralEntityName
    )}Input`
  );
}
