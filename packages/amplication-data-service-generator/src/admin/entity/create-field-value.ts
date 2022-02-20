import { namedTypes } from "ast-types";
import {
  EntityField,
  EnumDataType,
  LookupResolvedProperties,
} from "../../types";
import { jsxElement } from "../util";
import pluralize from "pluralize";

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
      const {
        relatedEntity: relatedEntityLookup,
      } = field.properties as LookupResolvedProperties;
      return jsxElement`<ReferenceField label="${
        field.displayName
      }" source="${relatedEntityLookup.name.toLowerCase()}.id" reference="${
        relatedEntityLookup.name
      }">
            <TextField source={${relatedEntityLookup.name.toUpperCase()}_TITLE_FIELD} /> 
        </ReferenceField>`;
    case EnumDataType.LookupMultiSelect:
      const {
        relatedEntity: relatedEntityLookupMultiSelect,
      } = field.properties as LookupResolvedProperties;
      return jsxElement`<ReferenceArrayInput
      source="${pluralize(relatedEntityLookupMultiSelect.name)}" 
      reference="${relatedEntityLookupMultiSelect.name.toUpperCase()}"
      parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
      format={(value: any) => value && value.map((v: any) => v.id)}
      >
        <SelectArrayInput optionText={${relatedEntityLookupMultiSelect.name.toUpperCase()}_TITLE_FIELD} />
      </ReferenceArrayInput>
      `;
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
