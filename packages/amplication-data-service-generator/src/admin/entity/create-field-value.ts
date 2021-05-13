import { namedTypes } from "ast-types";
import {
  EntityField,
  EnumDataType,
  LookupResolvedProperties,
} from "../../types";
import { jsxElement } from "../util";
/**
 * Creates a node for displaying given entity field value
 * @param field the entity field to create value view for
 * @returns the node AST representation
 */
export function createFieldValue(
  field: EntityField
): namedTypes.JSXElement | namedTypes.JSXFragment {
  switch (field.dataType) {
    case EnumDataType.CreatedAt:
    case EnumDataType.UpdatedAt:
      return jsxElement`<DateField source="${field.name}" label="${field.displayName}" />`;
    case EnumDataType.Lookup:
      const { relatedEntity } = field.properties as LookupResolvedProperties;
      return jsxElement`<ReferenceField label="${
        field.displayName
      }" source="${relatedEntity.name.toLowerCase()}.id" reference="${
        relatedEntity.name
      }">
            <TextField source={${relatedEntity.name.toUpperCase()}_TITLE_FIELD} /> 
        </ReferenceField>`;
    case EnumDataType.Boolean:
      return jsxElement`<BooleanField label="${field.displayName}" source="${field.name}" />`;
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
    case EnumDataType.Json:
    default:
      return jsxElement`<TextField label="${field.displayName}" source="${field.name}" />`;
  }
}
