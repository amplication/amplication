import { print } from "recast";
import { builders } from "ast-types";
import { EntityField, Entity, EnumDataType } from "../../../types";
import { classDeclaration } from "../../../util/ast";
import { createFieldClassProperty } from "./create-field-class-property";
import { createEntityDTO, OBJECT_TYPE_DECORATOR } from "./create-entity-dto";

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

describe("createEntityDTO", () => {
  test("creates entity DTO", () => {
    expect(
      print(createEntityDTO(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME)).code
    ).toEqual(
      print(
        classDeclaration(
          builders.identifier(EXAMPLE_ENTITY_NAME),
          builders.classBody([
            createFieldClassProperty(
              EXAMPLE_ENTITY_FIELD,
              !EXAMPLE_ENTITY_FIELD.required,
              false,
              false,
              EXAMPLE_ENTITY_ID_TO_NAME
            ),
          ]),
          null,
          [OBJECT_TYPE_DECORATOR]
        )
      ).code
    );
  });
});
