import * as PrismaSchemaDSL from "prisma-schema-dsl";
import {
  createPrismaSchema,
  CLIENT_GENERATOR,
  DATA_SOURCE,
  createPrismaField,
  CUID_CALL_EXPRESSION,
  NOW_CALL_EXPRESSION,
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
      dataType: EnumDataType.Lookup,
      required: true,
      searchable: false,
      name: EXAMPLE_LOOKUP_FIELD_NAME,
      displayName: "Example Lookup Field",
      properties: {
        relatedEntityId: EXAMPLE_ENTITY.id,
        relatedEntity: EXAMPLE_ENTITY,
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
  ${EXAMPLE_LOOKUP_FIELD_NAME} ${EXAMPLE_ENTITY_NAME}
}`,
    ],
  ];
  test.each(cases)("%s", async (name, entities: Entity[], expected: string) => {
    const schema = await createPrismaSchema(entities);
    expect(schema).toBe(expected);
  });
});

describe("createPrismaField", () => {
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
      "Lookup",
      EnumDataType.Lookup,
      { relatedEntityId: EXAMPLE_ENTITY.id, relatedEntity: EXAMPLE_ENTITY },
      PrismaSchemaDSL.createObjectField(
        EXAMPLE_ENTITY_FIELD_NAME,
        EXAMPLE_ENTITY_NAME,
        false,
        true
      ),
    ],
    [
      "MultiSelectOptionSet",
      EnumDataType.MultiSelectOptionSet,
      {},
      PrismaSchemaDSL.createObjectField(
        EXAMPLE_ENTITY_FIELD_NAME,
        `Enum${EXAMPLE_ENTITY_FIELD_NAME}`,
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
        `Enum${EXAMPLE_ENTITY_FIELD_NAME}`,
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
      name: EXAMPLE_ENTITY_FIELD_NAME,
      displayName: "Example Field Display Name",
      dataType,
      required: true,
      searchable: false,
      properties,
    };
    expect(createPrismaField(field)).toEqual(expected);
  });
});
