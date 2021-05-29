import { Entity, EntityField } from "../types";
import { isEnumField, isToManyRelationField } from "./field";
import { camelCase } from "camel-case";
import { DTOs } from "../server/resource/create-dtos";
import { getNamedProperties } from "./ast";

export const ENTITY_NAME_REGEX = /^[A-Z][A-Za-z0-9]+$/;

export class InvalidEntityNameError extends Error {
  constructor(name: string) {
    super(
      `Invalid entity name: "${name}". Name must start with a capital latin letter and only contain alphanumeric characters`
    );
  }
}

export class InvalidEntityPluralNameError extends Error {
  constructor(pluralDisplayName: string, entityName: string) {
    super(
      `Invalid entity plural display name "${pluralDisplayName}" or entity name "${entityName}". The plural display name must be in the plural form, and the entity name must be in the singular form.`
    );
  }
}

/**
 * Validates given entity name to be in expected format, and compare entity name and entity plural name
 * @param entity
 * @throws {InvalidEntityNameError} When name is not in a valid format.
 * @throws {InvalidEntityPluralNameError} when name and plural name are not valid
 */
export function validateEntityName(entity: Entity): void {
  if (!entity.name.match(ENTITY_NAME_REGEX)) {
    throw new InvalidEntityNameError(entity.name);
  }

  if (
    camelCase(entity.name).toLowerCase() ===
    camelCase(entity.pluralDisplayName).toLowerCase()
  ) {
    throw new InvalidEntityPluralNameError(
      entity.pluralDisplayName,
      entity.name
    );
  }
}

export function getEnumFields(entity: Entity): EntityField[] {
  return entity.fields.filter(isEnumField);
}

export function getFieldsFromDTOWithoutToManyRelations(
  entity: Entity,
  dtos: DTOs
): EntityField[] {
  const entityDTO = dtos[entity.name].entity;

  const entityDTOProperties = getNamedProperties(entityDTO);

  const fieldNameToField = Object.fromEntries(
    entity.fields.map((field) => [field.name, field])
  );

  //get the fields from the DTO object excluding toMany relations
  return entityDTOProperties.flatMap((property) => {
    const field = fieldNameToField[property.key.name];
    if (isToManyRelationField(field)) {
      return [];
    }
    return [field];
  });
}
