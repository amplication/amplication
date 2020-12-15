import { types } from "@amplication/data";
import { EntityField, EnumDataType } from "../types";

const UNEDITABLE_FIELD_NAMES = new Set<string>([
  "id",
  "createdAt",
  "updatedAt",
]);
export const ENUM_DATA_TYPES: Set<EnumDataType> = new Set([
  EnumDataType.MultiSelectOptionSet,
  EnumDataType.OptionSet,
]);

export function isEditableField(field: EntityField): boolean {
  const editableFieldName = !UNEDITABLE_FIELD_NAMES.has(field.name);
  return (
    (editableFieldName && !isRelationField(field)) ||
    isOneToOneRelationField(field)
  );
}

export function isOneToOneRelationField(field: EntityField): boolean {
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

export function isRelationField(field: EntityField): boolean {
  return field.dataType === EnumDataType.Lookup;
}

export function isPasswordField(field: EntityField): boolean {
  return field.dataType === EnumDataType.Password;
}
