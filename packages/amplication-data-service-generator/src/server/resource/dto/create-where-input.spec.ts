import { builders } from "ast-types";
import { print } from "recast";
import { Entity } from "../../../types";
import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_NON_SEARCHABLE_SINGLE_LINE_TEXT_FIELD,
} from "../util/test-data";
import { createWhereInput, createWhereInputID } from "./create-where-input";
import { createInput } from "./create-input";

const EXAMPLE_ENTITY_ID = "EXAMPLE_ENTITY_ID";
const EXAMPLE_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  name: EXAMPLE_ENTITY_NAME,
  displayName: "Example Entity",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ID_FIELD],
  permissions: [],
};

const EXAMPLE_ENTITY_WITH_NON_SEARCHABLE_FIELD: Entity = {
  id: EXAMPLE_ENTITY_ID,
  name: EXAMPLE_ENTITY_NAME,
  displayName: "Example Entity",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ID_FIELD, EXAMPLE_NON_SEARCHABLE_SINGLE_LINE_TEXT_FIELD],
  permissions: [],
};

describe("createWhereInput", () => {
  test("creates input", () => {
    expect(print(createWhereInput(EXAMPLE_ENTITY)).code).toEqual(
      print(
        createInput(
          createWhereInputID(EXAMPLE_ENTITY_NAME),
          [EXAMPLE_ID_FIELD],
          EXAMPLE_ENTITY,
          true,
          true
        )
      ).code
    );
  });

  test("creates input only for searchable fields", () => {
    expect(
      print(createWhereInput(EXAMPLE_ENTITY_WITH_NON_SEARCHABLE_FIELD)).code
    ).toEqual(
      print(
        createInput(
          createWhereInputID(EXAMPLE_ENTITY_NAME),
          [EXAMPLE_ID_FIELD],
          EXAMPLE_ENTITY,
          true,
          true
        )
      ).code
    );
  });
});

describe("createWhereInputID", () => {
  test("creates identifier", () => {
    expect(createWhereInputID(EXAMPLE_ENTITY_NAME)).toEqual(
      builders.identifier(`${EXAMPLE_ENTITY_NAME}WhereInput`)
    );
  });
});
