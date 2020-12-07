import { namedTypes } from "ast-types";
import { EntityField } from "../../types";
import { jsxFragment } from "../util";

const FIELD_NAME_CREATED_AT = "createdAt";
const FIELD_NAME_UPDATED_AT = "updatedAt";

/**
 * Creates a node for displaying given entity field value
 * @param field the entity field to create value view for
 * @returns the node AST representation
 */
export function createFieldValue(
  field: EntityField,
  dataId: namedTypes.Identifier
): namedTypes.JSXFragment {
  if (
    field.name === FIELD_NAME_CREATED_AT ||
    field.name === FIELD_NAME_UPDATED_AT
  ) {
    return jsxFragment`<><TimeSince time={${dataId}.${field.name}} /></>`;
  }
  return jsxFragment`<>{JSON.stringify(${dataId}.${field.name})}</>`;
}
