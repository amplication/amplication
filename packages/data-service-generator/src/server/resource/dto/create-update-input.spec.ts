import { builders } from "ast-types";
import { print } from "@amplication/code-gen-utils";
import { Entity } from "@amplication/code-gen-types";
import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_SINGLE_LINE_TEXT_FIELD,
} from "../util/test-data";
import { createInput } from "./create-input";
import { createUpdateInputID } from "./create-update-input";
import { EntityDtoTypeEnum } from "./entity-dto-type-enum";
import { createEntityInputFiles } from "../create-dtos";

const EXAMPLE_ENTITY_ID = "EXAMPLE_ENTITY_ID";
const EXAMPLE_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  name: EXAMPLE_ENTITY_NAME,
  displayName: "Example Entity",
  pluralName: "ExampleEntities",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ID_FIELD, EXAMPLE_SINGLE_LINE_TEXT_FIELD],
  permissions: [],
};

describe("createUpdateInput", () => {
  describe("createUpdateInput", () => {
    test("creates update input", () => {
      expect(
        print(createEntityInputFiles(EXAMPLE_ENTITY).updateInput).code
      ).toEqual(
        print(
          createInput(
            createUpdateInputID(EXAMPLE_ENTITY_NAME),
            [EXAMPLE_SINGLE_LINE_TEXT_FIELD],
            EXAMPLE_ENTITY,
            true,
            false,
            EntityDtoTypeEnum.UpdateInput
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
