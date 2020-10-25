import { types } from "amplication-data";
import { EntityField, EnumDataType, EnumPrivateDataType } from "../../types";
import { isRelationField } from "../../util/entity";

const UNEDITABLE_FIELD_NAMES = new Set<string>([
  "id",
  "createdAt",
  "updatedAt",
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
    field.dataType === EnumPrivateDataType.Roles ||
    field.dataType === EnumDataType.MultiSelectOptionSet
  );
}
