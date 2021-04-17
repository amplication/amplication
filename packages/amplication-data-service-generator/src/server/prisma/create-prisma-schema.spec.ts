import * as PrismaSchemaDSL from "prisma-schema-dsl";
import {
  createPrismaSchema,
  CLIENT_GENERATOR,
  DATA_SOURCE,
  createPrismaFields,
  CUID_CALL_EXPRESSION,
  NOW_CALL_EXPRESSION,
  createRelationName,
} from "./create-prisma-schema";
import { Entity, EntityField, EnumDataType } from "../../types";

const GENERATOR_CODE = `generator ${CLIENT_GENERATOR.name} {
  provider = "${CLIENT_GENERATOR.provider}"
}`;

const EXAMPLE_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_OTHER_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_ENTITY_FIELD_NAME = "ExampleEntityFieldName";
const EXAMPLE_LOOKUP_ENTITY_NAME = "ExampleLookupEntity";
const EXAMPLE_LOOKUP_FIELD_NAME = "exampleLookupField";

const EXAMPLE_FIELD: EntityField = {
  id: "EXAMPLE_FIELD_ID",
  permanentId: "EXAMPLE_PERMANENT_FIELD_ID",
  name: EXAMPLE_ENTITY_FIELD_NAME,
  dataType: EnumDataType.SingleLineText,
  properties: {},
  required: true,
  description: "",
  displayName: "Example Field",
  searchable: true,
};

const EXAMPLE_UNREQUIRED_FIELD: EntityField = {
  ...EXAMPLE_FIELD,
  name: "ExampleUnrequiredField",
  displayName: "Example Unrequired Field",
  required: false,
};

const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  displayName: "Example Entity",
  pluralDisplayName: "Example",
  name: EXAMPLE_ENTITY_NAME,
  fields: [EXAMPLE_FIELD],
  permissions: [],
};

const EXAMPLE_ENTITY_WITH_UNREQUIRED_FIELD: Entity = {
  ...EXAMPLE_ENTITY,
  id: "EXAMPLE_ENTITY_WITH_UNREQUIRED_FIELD_ID",
  name: "ExampleEntityWithUnrequiredField",
  displayName: "Example Entity With Unrequired Field",
  fields: [EXAMPLE_UNREQUIRED_FIELD],
};

const EXAMPLE_OTHER_ENTITY: Entity = {
  id: "EXAMPLE_OTHER_ENTITY_ID",
  displayName: "Example Other Entity",
  pluralDisplayName: "Example Other Entities",
  name: EXAMPLE_OTHER_ENTITY_NAME,
  fields: [EXAMPLE_FIELD],
  permissions: [],
};

const EXAMPLE_LOOKUP_ENTITY: Entity = {
  id: "EXAMPLE_LOOKUP_ENTITY_ID",
  displayName: "Example Lookup Entity",
  pluralDisplayName: "Example Lookup Entities",
  name: EXAMPLE_LOOKUP_ENTITY_NAME,
  fields: [
    {
      id: "EXAMPLE_LOOKUP_FIELD_ID",
      permanentId: "EXAMPLE_LOOKUP_PERMANENT_FIELD_ID",
      dataType: EnumDataType.Lookup,
      required: true,
      searchable: false,
      name: EXAMPLE_LOOKUP_FIELD_NAME,
      displayName: "Example Lookup Field",
      properties: {
        relatedEntityId: EXAMPLE_ENTITY.id,
        relatedFieldId: EXAMPLE_FIELD.id,
        relatedEntity: EXAMPLE_ENTITY,
        relatedField: EXAMPLE_FIELD,
      },
    },
  ],
  permissions: [],
};

const DATA_SOURCE_CODE = `datasource ${DATA_SOURCE.name} {
  provider = "${DATA_SOURCE.provider}"
  url      = env("${DATA_SOURCE.url.name}")
}`;

const HEADER = [DATA_SOURCE_CODE, GENERATOR_CODE].join("\n\n");

describe("createPrismaSchema", () => {
  const cases: Array<[string, Entity[], string]> = [
    ["Empty", [], HEADER],
    [
      "Single model",
      [EXAMPLE_ENTITY],
      `${HEADER}

model ${EXAMPLE_ENTITY_NAME} {
  ${EXAMPLE_ENTITY_FIELD_NAME} String
}`,
    ],
    [
      "Single model with unrequired field",
      [EXAMPLE_ENTITY_WITH_UNREQUIRED_FIELD],
      `${HEADER}

model ${EXAMPLE_ENTITY_WITH_UNREQUIRED_FIELD.name} {
  ${EXAMPLE_UNREQUIRED_FIELD.name} String?
}`,
    ],
    [
      "Two models",
      [EXAMPLE_ENTITY, EXAMPLE_OTHER_ENTITY],
      `${HEADER}

model ${EXAMPLE_ENTITY_NAME} {
  ${EXAMPLE_ENTITY_FIELD_NAME} String
}

model ${EXAMPLE_OTHER_ENTITY_NAME} {
  ${EXAMPLE_ENTITY_FIELD_NAME} String
}`,
    ],
    [
      "Two models with lookup",
      [EXAMPLE_ENTITY, EXAMPLE_LOOKUP_ENTITY],
      `${HEADER}

model ${EXAMPLE_ENTITY_NAME} {
  ${EXAMPLE_ENTITY_FIELD_NAME} String
}

model ${EXAMPLE_LOOKUP_ENTITY_NAME} {
  ${EXAMPLE_LOOKUP_FIELD_NAME}   ${EXAMPLE_ENTITY_NAME} @relation(fields: [${EXAMPLE_LOOKUP_FIELD_NAME}Id], references: [id])
  ${EXAMPLE_LOOKUP_FIELD_NAME}Id String
}`,
    ],
  ];
  test.each(cases)("%s", async (name, entities: Entity[], expected: string) => {
    const schema = await createPrismaSchema(entities);
    expect(schema).toBe(expected);
  });
});

describe("createPrismaFields", () => {
  const cases: Array<[
    string,
    EnumDataType,
    EntityField["properties"],
    PrismaSchemaDSL.ScalarField | PrismaSchemaDSL.ObjectField
  ]> = [
    [
      "SingleLineText",
      EnumDataType.SingleLineText,
      {},
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true
      ),
    ],
    [
      "MultiLineText",
      EnumDataType.MultiLineText,
      {},
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true
      ),
    ],
    [
      "Email",
      EnumDataType.Email,
      {},
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true
      ),
    ],
    [
      "WholeNumber",
      EnumDataType.WholeNumber,
      {},
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSL.ScalarType.Int,
        false,
        true
      ),
    ],
    [
      "DateTime",
      EnumDataType.DateTime,
      {},
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSL.ScalarType.DateTime,
        false,
        true
      ),
    ],
    [
      "DecimalNumber",
      EnumDataType.DecimalNumber,
      {},
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSL.ScalarType.Float,
        false,
        true
      ),
    ],
    [
      "Boolean",
      EnumDataType.Boolean,
      {},
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSL.ScalarType.Boolean,
        false,
        true
      ),
    ],
    [
      "GeographicLocation",
      EnumDataType.GeographicLocation,
      {},
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true
      ),
    ],
    [
      "Json",
      EnumDataType.Json,
      {},
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSL.ScalarType.Json,
        false,
        true
      ),
    ],
    [
      "Lookup",
      EnumDataType.Lookup,
      {
        relatedEntityId: EXAMPLE_ENTITY.id,
        relatedEntity: EXAMPLE_ENTITY,
        relatedField: EXAMPLE_FIELD,
      },
      PrismaSchemaDSL.createObjectField(
        EXAMPLE_ENTITY_FIELD_NAME,
        EXAMPLE_ENTITY_NAME,
        false,
        true,
        null,
        [`${EXAMPLE_ENTITY_FIELD_NAME}Id`],
        [`id`]
      ),
    ],
    [
      "MultiSelectOptionSet",
      EnumDataType.MultiSelectOptionSet,
      {},
      PrismaSchemaDSL.createObjectField(
        EXAMPLE_ENTITY_FIELD_NAME,
        `Enum${EXAMPLE_ENTITY_NAME}${EXAMPLE_ENTITY_FIELD_NAME}`,
        true,
        true
      ),
    ],
    [
      "OptionSet",
      EnumDataType.OptionSet,
      {},
      PrismaSchemaDSL.createObjectField(
        EXAMPLE_ENTITY_FIELD_NAME,
        `Enum${EXAMPLE_ENTITY_NAME}${EXAMPLE_ENTITY_FIELD_NAME}`,
        false,
        true
      ),
    ],
    [
      "Id",
      EnumDataType.Id,
      {},
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true,
        false,
        true,
        false,
        CUID_CALL_EXPRESSION
      ),
    ],
    [
      "CreatedAt",
      EnumDataType.CreatedAt,
      {},
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSL.ScalarType.DateTime,
        false,
        true,
        false,
        false,
        false,
        NOW_CALL_EXPRESSION
      ),
    ],
    [
      "UpdatedAt",
      EnumDataType.UpdatedAt,
      {},
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSL.ScalarType.DateTime,
        false,
        true,
        false,
        false,
        true
      ),
    ],
    [
      "Roles",
      EnumDataType.Roles,
      {},
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSL.ScalarType.String,
        true,
        true
      ),
    ],
    [
      "Username",
      EnumDataType.Username,
      {},
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true,
        true
      ),
    ],
    [
      "Password",
      EnumDataType.Password,
      {},
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true
      ),
    ],
  ];
  test.each(cases)("%s", (name, dataType, properties, expected) => {
    const field: EntityField = {
      id: "EXAMPLE_FIELD_ID",
      permanentId: "EXAMPLE_PERMANENT_FIELD_ID",
      name: EXAMPLE_ENTITY_FIELD_NAME,
      displayName: "Example Field Display Name",
      dataType,
      required: true,
      searchable: false,
      properties,
    };
    expect(createPrismaFields(field, EXAMPLE_ENTITY)[0]).toEqual(expected);
  });
});

describe("createRelationName", () => {
  const cases: Array<[
    string,
    Entity,
    EntityField,
    Entity,
    EntityField,
    boolean,
    boolean,
    string
  ]> = [
    [
      "Unique field",
      { ...EXAMPLE_ENTITY },
      { ...EXAMPLE_FIELD, name: "bar" },
      { ...EXAMPLE_ENTITY },
      { ...EXAMPLE_FIELD },
      true,
      false,
      "bar",
    ],
    [
      "Unique related field",
      { ...EXAMPLE_ENTITY },
      { ...EXAMPLE_FIELD },
      { ...EXAMPLE_ENTITY },
      { ...EXAMPLE_FIELD, name: "foo" },
      false,
      true,
      "foo",
    ],
    [
      "Unique field and related field",
      { ...EXAMPLE_ENTITY },
      { ...EXAMPLE_FIELD, name: "bar" },
      { ...EXAMPLE_ENTITY },
      { ...EXAMPLE_FIELD, name: "foo" },
      true,
      true,
      "bar",
    ],
    [
      "Singular - Singular",
      { ...EXAMPLE_ENTITY, name: "Foo" },
      { ...EXAMPLE_FIELD, name: "bar" },
      { ...EXAMPLE_ENTITY, name: "Bar" },
      { ...EXAMPLE_FIELD, name: "foo" },
      false,
      false,
      "BarOnFoo",
    ],
    [
      "Singular - Singular Reversed",
      { ...EXAMPLE_ENTITY, name: "Bar" },
      { ...EXAMPLE_FIELD, name: "foo" },
      { ...EXAMPLE_ENTITY, name: "Foo" },
      { ...EXAMPLE_FIELD, name: "bar" },
      false,
      false,
      "BarOnFoo",
    ],
    [
      "Plural - Singular",
      { ...EXAMPLE_ENTITY, name: "Foo" },
      { ...EXAMPLE_FIELD, name: "bars" },
      { ...EXAMPLE_ENTITY, pluralDisplayName: "Bars" },
      { ...EXAMPLE_FIELD, name: "foo" },
      false,
      false,
      "BarsOnFoo",
    ],
    [
      "Singular - Plural",
      { ...EXAMPLE_ENTITY, pluralDisplayName: "Bars" },
      { ...EXAMPLE_FIELD, name: "foo" },
      { ...EXAMPLE_ENTITY, name: "Foo" },
      { ...EXAMPLE_FIELD, name: "bars" },
      false,
      false,
      "BarsOnFoo",
    ],
    [
      "Plural - Plural",
      { ...EXAMPLE_ENTITY, pluralDisplayName: "Bars" },
      { ...EXAMPLE_FIELD, name: "foos" },
      { ...EXAMPLE_ENTITY, pluralDisplayName: "Foos" },
      { ...EXAMPLE_FIELD, name: "bars" },
      false,
      false,
      "BarsOnFoos",
    ],
    [
      "Self Singular",
      { ...EXAMPLE_ENTITY, name: "Foo" },
      { ...EXAMPLE_FIELD, name: "foo" },
      { ...EXAMPLE_ENTITY, name: "Foo" },
      { ...EXAMPLE_FIELD, name: "foo" },
      false,
      false,
      "FooOnFoo",
    ],
    [
      "Self Plural",
      { ...EXAMPLE_ENTITY, pluralDisplayName: "Foos" },
      { ...EXAMPLE_FIELD, name: "foos" },
      { ...EXAMPLE_ENTITY, pluralDisplayName: "Foos" },
      { ...EXAMPLE_FIELD, name: "foos" },
      false,
      false,
      "FoosOnFoos",
    ],
  ];
  test.each(cases)(
    "%s",
    (
      name,
      entity,
      field,
      relatedEntity,
      relatedField,
      fieldHasUniqueName,
      relatedFieldHasUniqueName,
      expected
    ) => {
      expect(
        createRelationName(
          entity,
          field,
          relatedEntity,
          relatedField,
          fieldHasUniqueName,
          relatedFieldHasUniqueName
        )
      ).toEqual(expected);
    }
  );
});
