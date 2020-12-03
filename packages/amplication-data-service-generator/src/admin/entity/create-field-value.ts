import { namedTypes } from "ast-types";
import { EntityField } from "../../types";
import { jsxFragment } from "../util";

/**
 * Creates a node for displaying given entity field value
 * @param field the entity field to create value view for
 * @returns the node AST representation
 */
export function createFieldValue(
  field: EntityField,
  dataId: namedTypes.Identifier
): namedTypes.JSXFragment {
  return jsxFragment`<>{JSON.stringify(${dataId}.${field.name})}</>`;
}
