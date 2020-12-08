import { namedTypes } from "ast-types";
import { memberExpression } from "../../util/ast";
import { EntityField, EnumDataType } from "../../types";
import { jsxElement, jsxFragment } from "../util";

/**
 * Creates a node for displaying given entity field value
 * @param field the entity field to create value view for
 * @returns the node AST representation
 */
export function createFieldValue(
  field: EntityField,
  dataId: namedTypes.Identifier
): namedTypes.JSXElement | namedTypes.JSXFragment {
  const value = memberExpression`${dataId}.${field.name}`;
  switch (field.dataType) {
    case EnumDataType.CreatedAt:
    case EnumDataType.UpdatedAt:
      return jsxElement`<TimeSince time={${value}} />`;
    case EnumDataType.Lookup:
      return jsxFragment`<>{${value}.id}</>`;
    default:
      return jsxFragment`<>{${value}}</>`;
  }
}
