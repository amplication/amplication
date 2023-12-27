import { builders } from "ast-types";
import { print } from "@amplication/code-gen-utils";
import { Entity } from "@amplication/code-gen-types";
import { classDeclaration } from "../../../utils/ast";
import { EXAMPLE_ID_FIELD } from "../util/test-data";
import { OBJECT_TYPE_DECORATOR } from "./create-entity-dto";
import { createFieldClassProperty } from "./create-field-class-property";
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
  fields: [EXAMPLE_ID_FIELD],
  permissions: [],
};

describe("createEntityDTO", () => {
  test("creates entity DTO", () => {
    expect(print(createEntityInputFiles(EXAMPLE_ENTITY).entity).code).toEqual(
      print(
        classDeclaration(
          builders.identifier(EXAMPLE_ENTITY_NAME),
          builders.classBody([
            createFieldClassProperty(
              EXAMPLE_ID_FIELD,
              EXAMPLE_ENTITY,
              !EXAMPLE_ID_FIELD.required,
              false,
              true,
              EntityDtoTypeEnum.Entity
            ),
          ]),
          null,
          [OBJECT_TYPE_DECORATOR]
        )
      ).code
    );
  });
});
