import { namedTypes } from "ast-types";
import { memberExpression } from "../../util/ast";
import {
  EntityField,
  EnumDataType,
  LookupResolvedProperties,
} from "../../types";
import { jsxElement, jsxFragment } from "../util";
import { EntityComponent } from "../types";
/**
 * Creates a node for displaying given entity field value
 * @param field the entity field to create value view for
 * @returns the node AST representation
 */
export function createFieldValue(
  field: EntityField,
  dataId: namedTypes.Identifier,
  entityToTitleComponent: Record<string, EntityComponent>
): namedTypes.JSXElement | namedTypes.JSXFragment {
  const value = memberExpression`${dataId}.${field.name}`;
  switch (field.dataType) {
    case EnumDataType.CreatedAt:
    case EnumDataType.UpdatedAt:
      return jsxElement`<TimeSince time={${value}} />`;
    case EnumDataType.Lookup:
      const { relatedEntity } = field.properties as LookupResolvedProperties;
      const relatedEntityTitleComponent =
        entityToTitleComponent[relatedEntity.name];

      return jsxElement`<${relatedEntityTitleComponent.name} id={${value}?.id}  />`;

    case EnumDataType.Boolean:
      return jsxFragment`<>{${value} && <CircleIcon icon="check" style={EnumCircleIconStyle.positive} />}</>`;
    case EnumDataType.DateTime:
    case EnumDataType.DecimalNumber:
    case EnumDataType.Email:
    case EnumDataType.GeographicLocation:
    case EnumDataType.Id:
    case EnumDataType.MultiLineText:
    case EnumDataType.MultiSelectOptionSet:
    case EnumDataType.OptionSet:
    case EnumDataType.Password:
    case EnumDataType.Roles:
    case EnumDataType.SingleLineText:
    case EnumDataType.Username:
    case EnumDataType.WholeNumber:
    default:
      return jsxFragment`<>{${value}}</>`;
  }
}
