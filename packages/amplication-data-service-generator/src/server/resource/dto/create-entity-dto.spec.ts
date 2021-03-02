import { builders } from "ast-types";
import { print } from "recast";
import { Entity } from "../../../types";
import { EXAMPLE_ID_FIELD } from "../util/test-data";
import { classDeclaration } from "../../../util/ast";
import { createFieldClassProperty } from "./create-field-class-property";
import { createEntityDTO, OBJECT_TYPE_DECORATOR } from "./create-entity-dto";

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

describe("createEntityDTO", () => {
  test("creates entity DTO", () => {
    expect(print(createEntityDTO(EXAMPLE_ENTITY)).code).toEqual(
      print(
        classDeclaration(
          builders.identifier(EXAMPLE_ENTITY_NAME),
          builders.classBody([
            createFieldClassProperty(
              EXAMPLE_ID_FIELD,
              EXAMPLE_ENTITY,
              !EXAMPLE_ID_FIELD.required,
              false,
              false
            ),
          ]),
          null,
          [OBJECT_TYPE_DECORATOR]
        )
      ).code
    );
  });
});
