import { builders, namedTypes } from "ast-types";
import { print } from "recast";
import { EntityField, Entity, EnumDataType } from "../../../types";
import { NamedClassDeclaration } from "../../../util/ast";
import { createFieldClassProperty } from "./create-field-class-property";
import { createCreateInput, createCreateInputID } from "./create-create-input";
import { createInput } from "./create-input";

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

describe("createCreateInput", () => {
  test("creates create input", () => {
    expect(
      print(createCreateInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME)).code
    ).toEqual(
      print(
        createInput(
          createCreateInputID(EXAMPLE_ENTITY_NAME),
          [EXAMPLE_ENTITY_FIELD],
          false,
          false,
          EXAMPLE_ENTITY_ID_TO_NAME
        )
      ).code
    );
  });
});

describe("createCreateInputID", () => {
  test("creates identifier", () => {
    expect(createCreateInputID(EXAMPLE_ENTITY_NAME)).toEqual(
      builders.identifier(`${EXAMPLE_ENTITY_NAME}CreateInput`)
    );
  });
});
