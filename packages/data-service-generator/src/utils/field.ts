import {
  EntityField,
  EntityLookupField,
  EnumDataType,
  types,
} from "@amplication/code-gen-types";

const UNEDITABLE_FIELD_TYPES = new Set<EnumDataType>([
  EnumDataType.Id,
  EnumDataType.CreatedAt,
  EnumDataType.UpdatedAt,
]);

export const ENUM_DATA_TYPES: Set<EnumDataType> = new Set([
  EnumDataType.MultiSelectOptionSet,
  EnumDataType.OptionSet,
]);

export function isEditableField(field: EntityField): boolean {
  const editableFieldType = !UNEDITABLE_FIELD_TYPES.has(field.dataType);
  return editableFieldType;
}

export function isOneToOneRelationField(
  field: EntityField
): field is EntityLookupField {
  if (!isRelationField(field)) {
    return false;
  }
  const properties = field.properties as types.Lookup;
  return !properties.allowMultipleSelection;
}

export function isScalarListField(field: EntityField): boolean {
  return (
    field.dataType === EnumDataType.Roles ||
    field.dataType === EnumDataType.MultiSelectOptionSet
  );
}

export function isEnumField(field: EntityField): boolean {
  return ENUM_DATA_TYPES.has(field.dataType);
}

export function isRelationField(
  field: EntityField
): field is EntityLookupField {
  return field.dataType === EnumDataType.Lookup;
}

export function isToManyRelationField(
  field: EntityField
): field is EntityLookupField {
  return isRelationField(field) && !isOneToOneRelationField(field);
}

export function isPasswordField(field: EntityField): boolean {
  return field.dataType === EnumDataType.Password;
}
