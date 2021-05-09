import { EntityField, EnumDataType } from "../../../types";

export const EXAMPLE_ID_FIELD: EntityField = {
  id: "EXAMPLE_ID_FIELD_ID",
  permanentId: "EXAMPLE_ID_PERMANENT_FIELD_ID",
  dataType: EnumDataType.Id,
  displayName: "ID",
  name: "id",
  required: true,
  searchable: true,
  properties: {},
  description: "The entity identifier",
};

export const EXAMPLE_SINGLE_LINE_TEXT_FIELD: EntityField = {
  id: "EXAMPLE_SINGLE_LINE_TEXT_FIELD_ID",
  permanentId: "EXAMPLE_SINGLE_LINE_PERMANENT_FIELD_ID",
  dataType: EnumDataType.SingleLineText,
  displayName: "Example Single Line Text Field",
  name: "exampleSingleLineTextField",
  required: true,
  searchable: true,
  properties: {},
  description: "Example Single Line Text Field Description",
};

export const EXAMPLE_NON_SEARCHABLE_SINGLE_LINE_TEXT_FIELD: EntityField = {
  id: "EXAMPLE_SINGLE_LINE_TEXT_FIELD_ID",
  permanentId: "EXAMPLE_SINGLE_LINE_PERMANENT_FIELD_ID",
  dataType: EnumDataType.SingleLineText,
  displayName: "Example Single Line Text Field",
  name: "exampleSingleLineTextField",
  required: true,
  searchable: false,
  properties: {},
  description: "Example Single Line Text Field Description",
};

export const EXAMPLE_OTHER_ENTITY_ID = "EXAMPLE_OTHER_ENTITY_ID";
export const EXAMPLE_OTHER_ENTITY = {
  id: EXAMPLE_OTHER_ENTITY_ID,
  name: "ExampleOtherEntity",
};

export const EXAMPLE_LOOKUP_FIELD: EntityField = {
  id: "EXAMPLE_LOOKUP_FIELD_ID",
  permanentId: "EXAMPLE_LOOKUP_PERMANENT_FIELD_ID",
  dataType: EnumDataType.Lookup,
  displayName: "Example Lookup Field",
  name: "exampleLookupField",
  required: true,
  searchable: true,
  properties: {
    relatedEntityId: EXAMPLE_OTHER_ENTITY_ID,
    relatedEntity: EXAMPLE_OTHER_ENTITY,
  },
};
