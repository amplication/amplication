import { Entity, EntityField } from "../types";
import { isEnumField } from "./field";

export const ENTITY_NAME_REGEX = /^[A-Z][A-Za-z0-9]+$/;

export class InvalidEntityNameError extends Error {
  constructor(name: string) {
    super(
      `Invalid entity name: "${name}". Name must start with a capital latin letter and only contain alphanumeric characters`
    );
  }
}

/**
 * Validates given entity name to be in expected format, if fails
 * @param name name of the entity to validate
 * @throws {InvalidEntityNameError}
 */
export function validateEntityName(name: string): void {
  if (!name.match(ENTITY_NAME_REGEX)) {
    throw new InvalidEntityNameError(name);
  }
}

export function getEnumFields(entity: Entity): EntityField[] {
  return entity.fields.filter(isEnumField);
}
