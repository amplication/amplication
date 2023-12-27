import { namedTypes, builders } from "ast-types";
import { print } from "@amplication/code-gen-utils";
import {
  Entity,
  EntityField,
  EnumDataType,
  NamedClassDeclaration,
} from "@amplication/code-gen-types";
import { EXAMPLE_ID_FIELD } from "../util/test-data";
import {
  createObjectSelectProperty,
  createSelect,
  createSelectProperty,
  ID_ID,
  SELECT_ID,
  TRUE_BOOLEAN_LITERAL,
} from "./create-select";
import { createEntityInputFiles } from "../create-dtos";

const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  name: "ExampleEntityName",
  displayName: "Example Entity",
  pluralName: "ExampleEntities",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ID_FIELD],
  permissions: [],
};

export const EXAMPLE_FK_FIELD_NAME = "EXAMPLE_FK_FIELD_NAME";

const EXAMPLE_LOOKUP_FIELD: EntityField = {
  id: "EXAMPLE_LOOKUP_FIELD_ID",
  permanentId: "EXAMPLE_LOOKUP_PERMANENT_FIELD_ID",
  dataType: EnumDataType.Lookup,
  required: true,
  unique: false,
  searchable: false,
  name: "exampleLookupFieldName",
  displayName: "Example Lookup Field",
  properties: {
    relatedEntityId: EXAMPLE_ENTITY.id,
    relatedEntity: EXAMPLE_ENTITY,
    fkFieldName: EXAMPLE_FK_FIELD_NAME,
  },
};
const EXAMPLE_LOOKUP_ENTITY: Entity = {
  id: "EXAMPLE_LOOKUP_ENTITY_ID",
  displayName: "Example Lookup Entity",
  pluralName: "ExampleEntities",
  pluralDisplayName: "Example Lookup Entities",
  name: "ExampleLookupEntityName",
  fields: [EXAMPLE_LOOKUP_FIELD],
  permissions: [],
};
describe("createSelect", () => {
  const cases: Array<
    [string, NamedClassDeclaration, Entity, namedTypes.ObjectExpression]
  > = [
    [
      "adds true property for scalar field",
      createEntityInputFiles(EXAMPLE_ENTITY).entity,
      EXAMPLE_ENTITY,
      builders.objectExpression([
        createSelectProperty(builders.identifier(EXAMPLE_ID_FIELD.name)),
      ]),
    ],
    [
      "adds true property for lookup field",
      createEntityInputFiles(EXAMPLE_LOOKUP_ENTITY).entity,
      EXAMPLE_LOOKUP_ENTITY,
      builders.objectExpression([
        createObjectSelectProperty(
          builders.identifier(EXAMPLE_LOOKUP_FIELD.name),
          [createSelectProperty(ID_ID)]
        ),
      ]),
    ],
  ];
  test.each(cases)("%s", (name, entityDTO, entity, expected) => {
    expect(print(createSelect(entityDTO, entity)).code).toEqual(
      print(expected).code
    );
  });
});

test("createSelectProperty", () => {
  const key = builders.identifier("exampleKey");
  expect(createSelectProperty(key)).toEqual(
    builders.objectProperty(key, TRUE_BOOLEAN_LITERAL)
  );
});

test("createObjectSelectProperty", () => {
  const key = builders.identifier("exampleKey");
  const properties = [
    createSelectProperty(builders.identifier("exampleProperty")),
  ];
  expect(createObjectSelectProperty(key, properties)).toEqual(
    builders.objectProperty(
      key,
      builders.objectExpression([
        builders.objectProperty(
          SELECT_ID,
          builders.objectExpression(properties)
        ),
      ])
    )
  );
});
