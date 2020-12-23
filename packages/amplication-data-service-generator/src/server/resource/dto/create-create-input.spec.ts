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

const EXAMPLE_ENTITY_LOOKUP_FIELD: EntityField = {
  dataType: EnumDataType.Lookup,
  displayName: "Example Lookup Field",
  name: "exampleLookupField",
  required: true,
  searchable: false,
  properties: {
    relatedEntityId: EXAMPLE_OTHER_ENTITY_ID,
  },
};

const EXAMPLE_ENTITY_WITH_LOOKUP_FIELD: Entity = {
  id: "EXAMPLE_ENTITY_WITH_LOOKUP_FIELD_ID",
  name: "ExampleEntityWithLookupField",
  displayName: "Example Entity With Lookup Field",
  pluralDisplayName: "Example Entities With Lookup Field",
  fields: [EXAMPLE_ENTITY_LOOKUP_FIELD],
  permissions: [],
};

describe("createCreateInput", () => {
  const cases: Array<[string, Entity, namedTypes.ClassDeclaration]> = [
    [
      "entity with single ID field",
      EXAMPLE_ENTITY,
      createInput(
        builders.classDeclaration(
          createCreateInputID(EXAMPLE_ENTITY_NAME),
          builders.classBody([
            createFieldClassProperty(
              EXAMPLE_ENTITY_FIELD,
              !EXAMPLE_ENTITY_FIELD.required,
              true,
              false,
              EXAMPLE_ENTITY_ID_TO_NAME
            ),
          ])
        ) as NamedClassDeclaration
      ),
    ],
    [
      "entity with single lookup field",
      EXAMPLE_ENTITY_WITH_LOOKUP_FIELD,
      createInput(
        builders.classDeclaration(
          createCreateInputID(EXAMPLE_ENTITY_WITH_LOOKUP_FIELD.name),
          builders.classBody([
            createFieldClassProperty(
              EXAMPLE_ENTITY_LOOKUP_FIELD,
              !EXAMPLE_ENTITY_LOOKUP_FIELD.required,
              true,
              false,
              EXAMPLE_ENTITY_ID_TO_NAME
            ),
          ])
        ) as NamedClassDeclaration
      ),
    ],
  ];
  test.each(cases)("creates input for %s", (name, entity, expected) => {
    expect(
      print(createCreateInput(entity, EXAMPLE_ENTITY_ID_TO_NAME)).code
    ).toEqual(print(expected).code);
  });
});

describe("createCreateInputID", () => {
  test("creates identifier", () => {
    expect(createCreateInputID(EXAMPLE_ENTITY_NAME)).toEqual(
      builders.identifier(`${EXAMPLE_ENTITY_NAME}CreateInput`)
    );
  });
});
