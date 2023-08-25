import * as PrismaSchemaDSL from "prisma-schema-dsl";
import * as PrismaSchemaDSLTypes from "prisma-schema-dsl-types";
import {
  CUID_CALL_EXPRESSION,
  NOW_CALL_EXPRESSION,
  createRelationName,
  createPrismaFields,
} from "./create-prisma-schema-fields";

import {
  Entity,
  EntityField,
  EnumDataType,
  Module,
  serverDirectories,
} from "@amplication/code-gen-types";
import { CLIENT_GENERATOR, DATA_SOURCE } from "./constants";
import DsgContext from "../../dsg-context";

const GENERATOR_CODE = `generator ${CLIENT_GENERATOR.name} {
  provider = "${CLIENT_GENERATOR.provider}"
}`;

const EXAMPLE_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_OTHER_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_ENTITY_FIELD_NAME = "ExampleEntityFieldName";
const EXAMPLE_LOOKUP_ENTITY_NAME = "ExampleLookupEntity";
const EXAMPLE_LOOKUP_FIELD_NAME = "exampleLookupField";
const EXAMPLE_FK_FIELD_NAME = "ExampleFkFieldName";

const EXAMPLE_SERVER_DIRECTORIES: serverDirectories = {
  baseDirectory: "ExampleBaseDirectory",
  srcDirectory: "ExampleSrcDirectory",
  authDirectory: "ExampleAuthDirectory",
  scriptsDirectory: "ExampleScriptsDirectory",
  messageBrokerDirectory: "ExampleMessageBrokerDirectory",
};

const context = DsgContext.getInstance;
context.serverDirectories = EXAMPLE_SERVER_DIRECTORIES;

const EXAMPLE_FIELD: EntityField = {
  id: "EXAMPLE_FIELD_ID",
  permanentId: "EXAMPLE_PERMANENT_FIELD_ID",
  name: EXAMPLE_ENTITY_FIELD_NAME,
  dataType: EnumDataType.SingleLineText,
  properties: {},
  required: true,
  unique: false,
  description: "",
  displayName: "Example Field",
  searchable: true,
};

const EXAMPLE_UNREQUIRED_FIELD: EntityField = {
  ...EXAMPLE_FIELD,
  name: "ExampleUnrequiredField",
  displayName: "Example Unrequired Field",
  required: false,
  unique: false,
};

const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  displayName: "Example Entity",
  pluralDisplayName: "Example",
  pluralName: "ExampleEntity",
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
  pluralName: "ExampleOtherEntity",
  pluralDisplayName: "Example Other Entities",
  name: EXAMPLE_OTHER_ENTITY_NAME,
  fields: [EXAMPLE_FIELD],
  permissions: [],
};

const EXAMPLE_LOOKUP_ENTITY: Entity = {
  id: "EXAMPLE_LOOKUP_ENTITY_ID",
  displayName: "Example Lookup Entity",
  pluralName: "ExampleLookupEntities",
  pluralDisplayName: "Example Lookup Entities",
  name: EXAMPLE_LOOKUP_ENTITY_NAME,
  fields: [
    {
      id: "EXAMPLE_LOOKUP_FIELD_ID",
      permanentId: "EXAMPLE_LOOKUP_PERMANENT_FIELD_ID",
      dataType: EnumDataType.Lookup,
      required: true,
      unique: false,
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
  url      = env("${DATA_SOURCE.url}")
}`;

const HEADER = [DATA_SOURCE_CODE, GENERATOR_CODE].join("\n\n");

const MODULE_PATH = `${context.serverDirectories.baseDirectory}/prisma/schema.prisma`;

const singleModelSchema = `${HEADER}
model ${EXAMPLE_ENTITY_NAME} {
${EXAMPLE_ENTITY_FIELD_NAME} String
}`;

const singleModelUnrequiredField = `${HEADER}
model ${EXAMPLE_ENTITY_WITH_UNREQUIRED_FIELD.name} {
  ${EXAMPLE_UNREQUIRED_FIELD.name} String?
}`;

describe("createPrismaSchema", () => {
  const cases: Array<[string, Entity[], Module[], string, DsgContext]> = [
    ["Empty", [], [{ path: MODULE_PATH, code: HEADER }], HEADER, context],
    [
      "Single model",
      [EXAMPLE_ENTITY],
      [{ path: MODULE_PATH, code: singleModelSchema }],
      singleModelSchema,
      context,
    ],
    [
      "Single model with unrequired field",
      [EXAMPLE_ENTITY_WITH_UNREQUIRED_FIELD],
      [{ path: MODULE_PATH, code: singleModelUnrequiredField }],
      singleModelUnrequiredField,
      context,
    ],
    [
      "Two models",
      [EXAMPLE_ENTITY, EXAMPLE_OTHER_ENTITY],
      [{ path: MODULE_PATH, code: HEADER }],
      `${HEADER}

model ${EXAMPLE_ENTITY_NAME} {
  ${EXAMPLE_ENTITY_FIELD_NAME} String
}

model ${EXAMPLE_OTHER_ENTITY_NAME} {
  ${EXAMPLE_ENTITY_FIELD_NAME} String
}`,
      context,
    ],
    [
      "Two models with lookup",
      [EXAMPLE_ENTITY, EXAMPLE_LOOKUP_ENTITY],
      [{ path: MODULE_PATH, code: HEADER }],
      `${HEADER}

model ${EXAMPLE_ENTITY_NAME} {
  ${EXAMPLE_ENTITY_FIELD_NAME} String
}

model ${EXAMPLE_LOOKUP_ENTITY_NAME} {
  ${EXAMPLE_LOOKUP_FIELD_NAME}   ${EXAMPLE_ENTITY_NAME} @relation(fields: [${EXAMPLE_LOOKUP_FIELD_NAME}Id], references: [id])
  ${EXAMPLE_LOOKUP_FIELD_NAME}Id String            @unique
}`,
      context,
    ],
  ];
  test.each(cases)(
    "%s",
    async (name, entities: Entity[], expected: Module[]) => {
      // const schema = await createPrismaSchema({
      //   entities,
      //   dataSource: DATA_SOURCE,
      //   clientGenerator: CLIENT_GENERATOR,
      // });
      //expect(schema).toStrictEqual(expected);
    }
  );
});

describe("createPrismaFields", () => {
  const cases: Array<
    [
      string,
      EnumDataType,
      EntityField["properties"],
      PrismaSchemaDSLTypes.ScalarField | PrismaSchemaDSLTypes.ObjectField
    ]
  > = [
    [
      "SingleLineText",
      EnumDataType.SingleLineText,
      {},
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSLTypes.ScalarType.String,
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
        PrismaSchemaDSLTypes.ScalarType.String,
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
        PrismaSchemaDSLTypes.ScalarType.String,
        false,
        true
      ),
    ],
    [
      "WholeNumber",
      EnumDataType.WholeNumber,
      { databaseFieldType: "INT" },
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSLTypes.ScalarType.Int,
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
        PrismaSchemaDSLTypes.ScalarType.DateTime,
        false,
        true
      ),
    ],
    [
      "DecimalNumber",
      EnumDataType.DecimalNumber,
      { databaseFieldType: "FLOAT" },
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSLTypes.ScalarType.Float,
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
        PrismaSchemaDSLTypes.ScalarType.Boolean,
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
        PrismaSchemaDSLTypes.ScalarType.String,
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
        PrismaSchemaDSLTypes.ScalarType.Json,
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
        fkFieldName: `${EXAMPLE_ENTITY_FIELD_NAME}Id`,
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
      "Lookup With Custom Foreign Key Field Name",
      EnumDataType.Lookup,
      {
        relatedEntityId: EXAMPLE_ENTITY.id,
        relatedEntity: EXAMPLE_ENTITY,
        relatedField: EXAMPLE_FIELD,
        fkFieldName: EXAMPLE_FK_FIELD_NAME,
      },
      PrismaSchemaDSL.createObjectField(
        EXAMPLE_ENTITY_FIELD_NAME,
        EXAMPLE_ENTITY_NAME,
        false,
        true,
        null,
        [EXAMPLE_FK_FIELD_NAME],
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
      { idType: "CUID" },
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSLTypes.ScalarType.String,
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
        PrismaSchemaDSLTypes.ScalarType.DateTime,
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
        PrismaSchemaDSLTypes.ScalarType.DateTime,
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
        PrismaSchemaDSLTypes.ScalarType.Json,
        false,
        true
      ),
    ],
    [
      "Username",
      EnumDataType.Username,
      {},
      PrismaSchemaDSL.createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        PrismaSchemaDSLTypes.ScalarType.String,
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
        PrismaSchemaDSLTypes.ScalarType.String,
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
      unique: false,
      searchable: false,
      properties,
    };
    expect(createPrismaFields(field, EXAMPLE_ENTITY)[0]).toEqual(expected);
  });
});

describe("createRelationName", () => {
  const cases: Array<
    [string, Entity, EntityField, Entity, EntityField, boolean, boolean, string]
  > = [
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
      { ...EXAMPLE_ENTITY, pluralDisplayName: "Bars", pluralName: "Bars" },
      { ...EXAMPLE_FIELD, name: "foo" },
      false,
      false,
      "BarsOnFoo",
    ],
    [
      "Singular - Plural",
      { ...EXAMPLE_ENTITY, pluralDisplayName: "Bars", pluralName: "Bars" },
      { ...EXAMPLE_FIELD, name: "foo" },
      { ...EXAMPLE_ENTITY, name: "Foo" },
      { ...EXAMPLE_FIELD, name: "bars" },
      false,
      false,
      "BarsOnFoo",
    ],
    [
      "Plural - Plural",
      { ...EXAMPLE_ENTITY, pluralDisplayName: "Bars", pluralName: "Bars" },
      { ...EXAMPLE_FIELD, name: "foos" },
      { ...EXAMPLE_ENTITY, pluralDisplayName: "Foos", pluralName: "Foos" },
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
      { ...EXAMPLE_ENTITY, pluralDisplayName: "Foos", pluralName: "Foos" },
      { ...EXAMPLE_FIELD, name: "foos" },
      { ...EXAMPLE_ENTITY, pluralDisplayName: "Foos", pluralName: "Foos" },
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
