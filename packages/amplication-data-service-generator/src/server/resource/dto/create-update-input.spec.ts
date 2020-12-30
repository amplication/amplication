import { builders } from "ast-types";
import { print } from "recast";
import { Entity } from "../../../types";
import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_SINGLE_LINE_TEXT_FIELD,
} from "../util/test-data";
import { createInput } from "./create-input";
import { createUpdateInput, createUpdateInputID } from "./create-update-input";

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

describe("createUpdateInput", () => {
  describe("createUpdateInput", () => {
    test("creates update input", () => {
      expect(print(createUpdateInput(EXAMPLE_ENTITY)).code).toEqual(
        print(
          createInput(
            createUpdateInputID(EXAMPLE_ENTITY_NAME),
            [EXAMPLE_SINGLE_LINE_TEXT_FIELD],
            EXAMPLE_ENTITY,
            true,
            false
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
