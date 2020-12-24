import { builders } from "ast-types";
import { print } from "recast";
import { EntityField, Entity, EnumDataType } from "../../../types";
import { createInput } from "./create-input";
import {
  createWhereUniqueInput,
  createWhereUniqueInputID,
} from "./create-where-unique-input";

const EXAMPLE_ENTITY_ID = "EXAMPLE_ENTITY_ID";
const EXAMPLE_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_ENTITY_ID_TO_NAME: Record<string, string> = {
  [EXAMPLE_ENTITY_ID]: EXAMPLE_ENTITY_NAME,
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

describe("createWhereUniqueInput", () => {
  test("creates input", () => {
    expect(
      print(createWhereUniqueInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME))
        .code
    ).toEqual(
      print(
        createInput(
          createWhereUniqueInputID(EXAMPLE_ENTITY_NAME),
          [EXAMPLE_ENTITY_FIELD],
          false,
          true,
          EXAMPLE_ENTITY_ID_TO_NAME
        )
      ).code
    );
  });
});

describe("createWhereUniqueInputID", () => {
  test("creates identifier", () => {
    expect(createWhereUniqueInputID(EXAMPLE_ENTITY_NAME)).toEqual(
      builders.identifier(`${EXAMPLE_ENTITY_NAME}WhereUniqueInput`)
    );
  });
});
