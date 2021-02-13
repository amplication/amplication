import { builders } from "ast-types";
import { print } from "recast";
import { Entity } from "../../../types";
import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_SINGLE_LINE_TEXT_FIELD,
} from "../util/test-data";
import { createCreateInput, createCreateInputID } from "./create-create-input";
import { createInput } from "./create-input";

const EXAMPLE_ENTITY_ID = "EXAMPLE_ENTITY_ID";
const EXAMPLE_ENTITY_NAME = "ExampleEntityName";

const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  name: EXAMPLE_ENTITY_NAME,
  displayName: "Example Entity",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ID_FIELD, EXAMPLE_SINGLE_LINE_TEXT_FIELD],
  permissions: [],
};

describe("createCreateInput", () => {
  test("creates create input", () => {
    expect(print(createCreateInput(EXAMPLE_ENTITY)).code).toEqual(
      print(
        createInput(
          createCreateInputID(EXAMPLE_ENTITY_NAME),
          [EXAMPLE_SINGLE_LINE_TEXT_FIELD],
          EXAMPLE_ENTITY,
          false,
          false
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
