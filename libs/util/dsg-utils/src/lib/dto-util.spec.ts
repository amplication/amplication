import {
  Entity,
  EntityField,
  EnumDataType,
  EnumModuleDtoType,
} from "@amplication/code-gen-types";
import {
  createEnumName,
  getDefaultDtosForEntity,
  getDefaultDtosForEnumField,
  getDefaultDtosForRelatedEntity,
} from "./dto-util";

const EXAMPLE_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_RELATED_ENTITY_NAME = "ExampleRelatedEntityName";

const EXAMPLE_ENTITY_PLURAL_NAME = "exampleEntityNames";
const EXAMPLE_RELATED_ENTITY_PLURAL_NAME = "exampleRelatedEntityNames";
const EXAMPLE_ENTITY_PLURAL_NAME_PASCAL = "ExampleEntityNames";

const EXAMPLE_ENTITY_DISPLAY_NAME = "Example Entity Name";
const EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME = "Example Entity Names";
const EXAMPLE_RELATED_ENTITY_PLURAL_DISPLAY_NAME = "Example Entity Names";

const EXAMPLE_FIELD_NAME_TO_MANY = "ExampleFieldNames";
const EXAMPLE_FIELD_DISPLAY_NAME_TO_MANY = "Example Field Names";
const EXAMPLE_FIELD_NAME_TO_ONE = "ExampleFieldName";
const EXAMPLE_FIELD_DISPLAY_NAME_TO_ONE = "Example Field Name";
const EXAMPLE_ENUM_FIELD_NAME = "ExampleEnumFieldName";
const EXAMPLE_ENUM_FIELD_DISPLAY_NAME = "Example Enum Field Name";

const EXAMPLE_FIELD_RELATED_TO_MANY: EntityField = {
  id: "EXAMPLE_FIELD_ID",
  permanentId: "EXAMPLE_PERMANENT_FIELD_ID",
  name: EXAMPLE_FIELD_NAME_TO_MANY,
  dataType: EnumDataType.Lookup,
  properties: {
    relatedEntityId: "RelatedEntityId",
    allowMultipleSelection: true,
    fkHolder: "ForeignKeyHolder",
    fkFieldName: "ForeignKeyFieldNameOptional",
    relatedFieldId: "RelatedField",
  },
  required: true,
  unique: false,
  description: "",
  displayName: EXAMPLE_FIELD_DISPLAY_NAME_TO_MANY,
  searchable: true,
};

const EXAMPLE_FIELD_RELATED_TO_ONE: EntityField = {
  id: "EXAMPLE_FIELD_ID",
  permanentId: "EXAMPLE_PERMANENT_FIELD_ID",
  name: EXAMPLE_FIELD_NAME_TO_ONE,
  dataType: EnumDataType.Lookup,
  properties: {
    relatedEntityId: "RelatedEntityId",
    allowMultipleSelection: false,
    fkHolder: "ForeignKeyHolder",
    fkFieldName: "ForeignKeyFieldNameOptional",
    relatedFieldId: "RelatedField",
  },
  required: true,
  unique: false,
  description: "",
  displayName: EXAMPLE_FIELD_DISPLAY_NAME_TO_ONE,
  searchable: true,
};

const EXAMPLE_ENUM_FIELD: EntityField = {
  id: "EXAMPLE_ENUM_FIELD_ID",
  permanentId: "EXAMPLE_PERMANENT_ENUM_FIELD_ID",
  name: EXAMPLE_ENUM_FIELD_NAME,
  dataType: EnumDataType.OptionSet,
  properties: {
    allowMultipleSelection: false,
  },
  required: true,
  unique: false,
  description: "",
  displayName: EXAMPLE_ENUM_FIELD_DISPLAY_NAME,
  searchable: true,
};

const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  displayName: EXAMPLE_ENTITY_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME,
  pluralName: EXAMPLE_ENTITY_PLURAL_NAME,
  name: EXAMPLE_ENTITY_NAME,
  fields: [EXAMPLE_FIELD_RELATED_TO_MANY, EXAMPLE_FIELD_RELATED_TO_ONE],
  permissions: [],
};

const EXAMPLE_RELATED_ENTITY: Entity = {
  id: "RelatedEntityId",
  displayName: EXAMPLE_ENTITY_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_RELATED_ENTITY_PLURAL_DISPLAY_NAME,
  pluralName: EXAMPLE_RELATED_ENTITY_PLURAL_NAME,
  name: EXAMPLE_RELATED_ENTITY_NAME,
  fields: [EXAMPLE_FIELD_RELATED_TO_ONE],
  permissions: [],
};

describe("getDefaultDtosForEntity", () => {
  it("should return a list of default dtos for entity", () => {
    expect(getDefaultDtosForEntity(EXAMPLE_ENTITY)).toEqual({
      [EnumModuleDtoType.Entity]: {
        dtoType: EnumModuleDtoType.Entity,
        name: EXAMPLE_ENTITY_NAME,
        description: `the ${EXAMPLE_ENTITY_DISPLAY_NAME} model`,
        enabled: true,
        properties: [],
      },
      [EnumModuleDtoType.CountArgs]: {
        dtoType: EnumModuleDtoType.CountArgs,
        name: `${EXAMPLE_ENTITY_NAME}CountArgs`,
        description: `Input type for ${EXAMPLE_ENTITY_DISPLAY_NAME} count`,
        enabled: true,
        properties: [],
      },
      [EnumModuleDtoType.CreateArgs]: {
        dtoType: EnumModuleDtoType.CreateArgs,
        name: `Create${EXAMPLE_ENTITY_NAME}Args`,
        description: `Args type for ${EXAMPLE_ENTITY_DISPLAY_NAME} creation`,
        enabled: true,
        properties: [],
      },
      [EnumModuleDtoType.CreateInput]: {
        dtoType: EnumModuleDtoType.CreateInput,
        name: `${EXAMPLE_ENTITY_NAME}CreateInput`,
        description: `Input type for ${EXAMPLE_ENTITY_DISPLAY_NAME} creation`,
        enabled: true,
        properties: [],
      },
      [EnumModuleDtoType.DeleteArgs]: {
        dtoType: EnumModuleDtoType.DeleteArgs,
        name: `Delete${EXAMPLE_ENTITY_NAME}Args`,
        description: `Args type for ${EXAMPLE_ENTITY_DISPLAY_NAME} deletion`,
        enabled: true,
        properties: [],
      },
      [EnumModuleDtoType.FindManyArgs]: {
        dtoType: EnumModuleDtoType.FindManyArgs,
        name: `${EXAMPLE_ENTITY_NAME}FindManyArgs`,
        description: `Args type for ${EXAMPLE_ENTITY_DISPLAY_NAME} search`,
        enabled: true,
        properties: [],
      },
      [EnumModuleDtoType.FindOneArgs]: {
        dtoType: EnumModuleDtoType.FindOneArgs,
        name: `${EXAMPLE_ENTITY_NAME}FindUniqueArgs`,
        description: `Args type for ${EXAMPLE_ENTITY_DISPLAY_NAME} retrieval`,
        enabled: true,
        properties: [],
      },
      [EnumModuleDtoType.ListRelationFilter]: {
        dtoType: EnumModuleDtoType.ListRelationFilter,
        name: `${EXAMPLE_ENTITY_NAME}ListRelationFilter`,
        description: `Input type for ${EXAMPLE_ENTITY_DISPLAY_NAME} relation filter`,
        enabled: true,
        properties: [],
      },
      [EnumModuleDtoType.OrderByInput]: {
        dtoType: EnumModuleDtoType.OrderByInput,
        name: `${EXAMPLE_ENTITY_NAME}OrderByInput`,
        description: `Input type for ${EXAMPLE_ENTITY_DISPLAY_NAME} sorting`,
        enabled: true,
        properties: [],
      },
      [EnumModuleDtoType.UpdateArgs]: {
        dtoType: EnumModuleDtoType.UpdateArgs,
        name: `Update${EXAMPLE_ENTITY_NAME}Args`,
        description: `Args type for ${EXAMPLE_ENTITY_DISPLAY_NAME} update`,
        enabled: true,
        properties: [],
      },
      [EnumModuleDtoType.UpdateInput]: {
        dtoType: EnumModuleDtoType.UpdateInput,
        name: `${EXAMPLE_ENTITY_NAME}UpdateInput`,
        description: `Input type for ${EXAMPLE_ENTITY_DISPLAY_NAME} update`,
        enabled: true,
        properties: [],
      },
      [EnumModuleDtoType.WhereInput]: {
        dtoType: EnumModuleDtoType.WhereInput,
        name: `${EXAMPLE_ENTITY_NAME}WhereInput`,
        description: `Input type for ${EXAMPLE_ENTITY_DISPLAY_NAME} search`,
        enabled: true,
        properties: [],
      },
      [EnumModuleDtoType.WhereUniqueInput]: {
        dtoType: EnumModuleDtoType.WhereUniqueInput,
        name: `${EXAMPLE_ENTITY_NAME}WhereUniqueInput`,
        description: `Input type for ${EXAMPLE_ENTITY_DISPLAY_NAME} retrieval`,
        enabled: true,
        properties: [],
      },
    });
  });
});

describe("getDefaultDtosForRelatedEntity", () => {
  it("should return a list of default dtos for related entity", () => {
    expect(
      getDefaultDtosForRelatedEntity(EXAMPLE_ENTITY, EXAMPLE_RELATED_ENTITY)
    ).toEqual({
      [EnumModuleDtoType.CreateNestedManyInput]: {
        dtoType: EnumModuleDtoType.CreateNestedManyInput,
        name: `${EXAMPLE_RELATED_ENTITY_NAME}CreateNestedManyWithout${EXAMPLE_ENTITY_PLURAL_NAME_PASCAL}Input`,
        description: `Input type for ${EXAMPLE_ENTITY_DISPLAY_NAME} creation with related ${EXAMPLE_RELATED_ENTITY_NAME}`,
        enabled: true,
        properties: [],
      },
      [EnumModuleDtoType.UpdateNestedManyInput]: {
        dtoType: EnumModuleDtoType.UpdateNestedManyInput,
        name: `${EXAMPLE_RELATED_ENTITY_NAME}UpdateManyWithout${EXAMPLE_ENTITY_PLURAL_NAME_PASCAL}Input`,
        description: `Input type for ${EXAMPLE_ENTITY_DISPLAY_NAME} retrieval`,
        enabled: true,
        properties: [],
      },
    });
  });
});

describe("getDefaultDtosForEnumField", () => {
  it("should return a default dto for enum field", () => {
    expect(
      getDefaultDtosForEnumField(EXAMPLE_ENTITY, EXAMPLE_ENUM_FIELD)
    ).toEqual({
      dtoType: EnumModuleDtoType.Enum,
      name: createEnumName(EXAMPLE_ENUM_FIELD, EXAMPLE_ENTITY),
      description: `Enum type for field ${EXAMPLE_ENUM_FIELD_NAME} of ${EXAMPLE_ENTITY_DISPLAY_NAME} model`,
      enabled: true,
      properties: [],
    });
  });
});
