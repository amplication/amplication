import { builders } from "ast-types";
import { print } from "recast";
import { Entity } from "../../../types";
import { EXAMPLE_ID_FIELD } from "../util/test-data";
import { createInput } from "./create-input";
import {
  createWhereUniqueInput,
  createWhereUniqueInputID,
} from "./create-where-unique-input";

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

describe("createWhereUniqueInput", () => {
  test("creates input", () => {
    expect(print(createWhereUniqueInput(EXAMPLE_ENTITY)).code).toEqual(
      print(
        createInput(
          createWhereUniqueInputID(EXAMPLE_ENTITY_NAME),
          [EXAMPLE_ID_FIELD],
          EXAMPLE_ENTITY,
          false,
          false
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
