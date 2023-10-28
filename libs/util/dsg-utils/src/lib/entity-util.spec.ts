import {
  Entity,
  EntityField,
  EnumDataType,
  EnumModuleActionType,
} from "@amplication/code-gen-types";
import {
  prepareEntityPluralName,
  getDefaultActionsForEntity,
  getDefaultActionsForRelatedField,
} from "./entity-util";

const EXAMPLE_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_ENTITY_PLURAL_NAME = "ExampleEntityNames";
const EXAMPLE_ENTITY_DISPLAY_NAME = "Example Entity Name";
const EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME = "Example Entity Names";

const EXAMPLE_FIELD_NAME_TO_MANY = "ExampleFieldNames";
const EXAMPLE_FIELD_DISPLAY_NAME_TO_MANY = "Example Field Names";
const EXAMPLE_FIELD_NAME_TO_ONE = "ExampleFieldName";
const EXAMPLE_FIELD_DISPLAY_NAME_TO_ONE = "Example Field Name";

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

const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  displayName: EXAMPLE_ENTITY_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME,
  pluralName: EXAMPLE_ENTITY_PLURAL_NAME,
  name: EXAMPLE_ENTITY_NAME,
  fields: [EXAMPLE_FIELD_RELATED_TO_MANY, EXAMPLE_FIELD_RELATED_TO_ONE],
  permissions: [],
};

describe("prepareEntityPluralName", () => {
  it("should return a plural name", () => {
    expect(prepareEntityPluralName("customer")).toEqual("customers");
  });
  it("should return a plural name with the suffix 'Items'", () => {
    expect(prepareEntityPluralName("aircraft")).toEqual("aircraftItems");
  });
});

describe("getDefaultActionsForEntity", () => {
  it("should return a list of default actions for entity", () => {
    expect(getDefaultActionsForEntity(EXAMPLE_ENTITY)).toEqual({
      [EnumModuleActionType.Meta]: {
        actionType: EnumModuleActionType.Meta,
        name: `_${EXAMPLE_ENTITY_PLURAL_NAME}Meta`,
        displayName: `${EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME} Meta`,
        description: `Meta data about ${EXAMPLE_ENTITY_DISPLAY_NAME} records`,
        enabled: true,
      },
      [EnumModuleActionType.Create]: {
        actionType: EnumModuleActionType.Create,
        name: `create${EXAMPLE_ENTITY_NAME}`,
        displayName: `Create ${EXAMPLE_ENTITY_DISPLAY_NAME}`,
        description: `Create one ${EXAMPLE_ENTITY_DISPLAY_NAME}`,
        enabled: true,
      },
      [EnumModuleActionType.Read]: {
        actionType: EnumModuleActionType.Read,
        name: `${EXAMPLE_ENTITY_NAME}`,
        displayName: `Get ${EXAMPLE_ENTITY_DISPLAY_NAME}`,
        description: `Get one ${EXAMPLE_ENTITY_DISPLAY_NAME}`,
        enabled: true,
      },
      [EnumModuleActionType.Update]: {
        actionType: EnumModuleActionType.Update,
        name: `update${EXAMPLE_ENTITY_NAME}`,
        displayName: `Update ${EXAMPLE_ENTITY_DISPLAY_NAME}`,
        description: `Update one ${EXAMPLE_ENTITY_DISPLAY_NAME}`,
        enabled: true,
      },
      [EnumModuleActionType.Delete]: {
        actionType: EnumModuleActionType.Delete,
        name: `delete${EXAMPLE_ENTITY_NAME}`,
        displayName: `Delete ${EXAMPLE_ENTITY_DISPLAY_NAME}`,
        description: `Delete one ${EXAMPLE_ENTITY_DISPLAY_NAME}`,
        enabled: true,
      },
      [EnumModuleActionType.Find]: {
        actionType: EnumModuleActionType.Find,
        name: `${EXAMPLE_ENTITY_PLURAL_NAME}`,
        displayName: `Find ${EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME}`,
        description: `Find many ${EXAMPLE_ENTITY_PLURAL_DISPLAY_NAME}`,
        enabled: true,
      },
    });
  });
});

describe("getDefaultActionsForRelatedField", () => {
  it("should return a list of default actions for relation field - To-Many ", () => {
    expect(
      getDefaultActionsForRelatedField(
        EXAMPLE_ENTITY,
        EXAMPLE_FIELD_RELATED_TO_MANY
      )
    ).toEqual({
      [EnumModuleActionType.ChildrenConnect]: {
        actionType: EnumModuleActionType.ChildrenConnect,
        name: `connect${EXAMPLE_FIELD_NAME_TO_MANY}`,
        displayName: `${EXAMPLE_ENTITY_DISPLAY_NAME} Connect ${EXAMPLE_FIELD_DISPLAY_NAME_TO_MANY}`,
        description: `Connect multiple ${EXAMPLE_FIELD_DISPLAY_NAME_TO_MANY} records to ${EXAMPLE_ENTITY_DISPLAY_NAME}`,
        enabled: true,
      },
      [EnumModuleActionType.ChildrenDisconnect]: {
        actionType: EnumModuleActionType.ChildrenDisconnect,
        name: `disconnect${EXAMPLE_FIELD_NAME_TO_MANY}`,
        displayName: `${EXAMPLE_ENTITY_DISPLAY_NAME} Disconnect ${EXAMPLE_FIELD_DISPLAY_NAME_TO_MANY}`,
        description: `Disconnect multiple ${EXAMPLE_FIELD_DISPLAY_NAME_TO_MANY} records from ${EXAMPLE_ENTITY_DISPLAY_NAME}`,
        enabled: true,
      },
      [EnumModuleActionType.ChildrenFind]: {
        actionType: EnumModuleActionType.ChildrenFind,
        name: `find${EXAMPLE_FIELD_NAME_TO_MANY}`,
        displayName: `${EXAMPLE_ENTITY_DISPLAY_NAME} Find ${EXAMPLE_FIELD_DISPLAY_NAME_TO_MANY}`,
        description: `Find multiple ${EXAMPLE_FIELD_DISPLAY_NAME_TO_MANY} records for ${EXAMPLE_ENTITY_DISPLAY_NAME}`,
        enabled: true,
      },
      [EnumModuleActionType.ChildrenUpdate]: {
        actionType: EnumModuleActionType.ChildrenUpdate,
        name: `update${EXAMPLE_FIELD_NAME_TO_MANY}`,
        displayName: `${EXAMPLE_ENTITY_DISPLAY_NAME} Update ${EXAMPLE_FIELD_DISPLAY_NAME_TO_MANY}`,
        description: `Update multiple ${EXAMPLE_FIELD_DISPLAY_NAME_TO_MANY} records for ${EXAMPLE_ENTITY_DISPLAY_NAME}`,
        enabled: true,
      },
    });
  });

  it("should return a list of default actions for relation field - To-One ", () => {
    expect(
      getDefaultActionsForRelatedField(
        EXAMPLE_ENTITY,
        EXAMPLE_FIELD_RELATED_TO_ONE
      )
    ).toEqual({
      [EnumModuleActionType.ParentGet]: {
        actionType: EnumModuleActionType.ParentGet,
        name: `get${EXAMPLE_FIELD_NAME_TO_ONE}`,
        displayName: `${EXAMPLE_ENTITY_DISPLAY_NAME} Get ${EXAMPLE_FIELD_DISPLAY_NAME_TO_ONE}`,
        description: `Get a ${EXAMPLE_FIELD_DISPLAY_NAME_TO_ONE} record for ${EXAMPLE_ENTITY_DISPLAY_NAME}`,
        enabled: true,
      },
    });
  });
});
