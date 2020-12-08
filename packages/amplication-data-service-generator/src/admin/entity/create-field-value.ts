import { namedTypes } from "ast-types";
import { EntityField, EnumDataType } from "../../types";
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
  switch (field.dataType) {
    case EnumDataType.CreatedAt:
    case EnumDataType.UpdatedAt:
      return jsxFragment`<><TimeSince time={${dataId}.${field.name}} /></>`;
    case EnumDataType.Lookup:
      return jsxFragment`<>{${dataId}.${field.name}.id}</>`;
    default:
      return jsxFragment`<>{${dataId}.${field.name}}</>`;
  }
}
