import { DATA_TYPE_TO_SCHEMA } from "./data-type-to-schema";
import * as models from "./models";
import type { JSONSchema7 } from "json-schema";

export type Schema = JSONSchema7;

/**
 * Gets the JSON Schema for the properties of the given entity field data type
 * @param dataType the entity field data type to get the properties schema for
 * @returns the JSON Schema of the properties of the given entity field data type
 */
export function getSchemaForDataType(dataType: models.EnumDataType): Schema {
  return DATA_TYPE_TO_SCHEMA[dataType];
}
