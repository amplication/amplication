import { builders, namedTypes } from "ast-types";
import { print } from "recast";
import { NamedClassDeclaration } from "../../../util/ast";
import { EntityField, Entity, EnumDataType } from "../../../types";
import { createFieldClassProperty } from "./create-field-class-property";
import { createInput } from "./create-input";
import { createUpdateInput, createUpdateInputID } from "./create-update-input";

const EXAMPLE_ENTITY_ID = "EXAMPLE_ENTITY_ID";
const EXAMPLE_OTHER_ENTITY_ID = "EXAMPLE_OTHER_ENTITY_ID";
const EXAMPLE_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_OTHER_ENTITY_NAME = "ExampleOtherEntityName";
const EXAMPLE_ENTITY_ID_TO_NAME: Record<string, string> = {
  [EXAMPLE_ENTITY_ID]: EXAMPLE_ENTITY_NAME,
  [EXAMPLE_OTHER_ENTITY_ID]: EXAMPLE_OTHER_ENTITY_NAME,
};

const EXAMPLE_ENTITY_FIELD_NAME = "exampleEntityFieldName";
const EXAMPLE_ENTITY_FIELD: EntityField = {
  name: EXAMPLE_ENTITY_FIELD_NAME,
  displayName: "Example Entity Field Display Name",
  description: "Example entity field description",
  dataType: EnumDataType.Id,
  required: true,
  searchable: false,
};
const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  name: EXAMPLE_ENTITY_NAME,
  displayName: "Example Entity",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ENTITY_FIELD],
  permissions: [],
};

const EXAMPLE_ENTITY_LOOKUP_FIELD: EntityField = {
  dataType: EnumDataType.Lookup,
  displayName: "Example Lookup Field",
  name: "exampleLookupField",
  required: true,
  searchable: false,
  properties: {
    relatedEntityId: EXAMPLE_OTHER_ENTITY_ID,
  },
};

describe("createUpdateInput", () => {
  describe("createUpdateInput", () => {
    test("creates create input", () => {
      expect(
        print(createUpdateInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME)).code
      ).toEqual(
        print(
          createInput(
            createUpdateInputID(EXAMPLE_ENTITY_NAME),
            [EXAMPLE_ENTITY_FIELD],
            true,
            false,
            EXAMPLE_ENTITY_ID_TO_NAME
          )
        ).code
      );
    });
  });
});

describe("createUpdateInputID", () => {
  test("creates identifier", () => {
    expect(createUpdateInputID(EXAMPLE_ENTITY_NAME)).toEqual(
      builders.identifier(`${EXAMPLE_ENTITY_NAME}UpdateInput`)
    );
  });
});
