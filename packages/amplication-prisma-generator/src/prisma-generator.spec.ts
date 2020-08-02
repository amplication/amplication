import { createPrismaSchema, CLIENT_GENERATOR } from "./prisma-generator";
import { Entity, EnumDataType } from "./types";
import * as PrismaSchemaDSL from "prisma-schema-dsl";

const GENERATOR_CODE = `generator ${CLIENT_GENERATOR.name} {
  provider = "${CLIENT_GENERATOR.provider}"
}`;

const USER_MODEL_CODE = `model User {
  username String @unique
  password String
}`;

const EXAMPLE_ENTITY_NAME = "exampleEntityName";
const EXAMPLE_OTHER_ENTITY_NAME = "exampleEntityName";
const EXAMPLE_ENTITY_FIELD_NAME = "exampleEntityFieldName";

const EXAMPLE_FIELD = {
  name: EXAMPLE_ENTITY_FIELD_NAME,
  dataType: EnumDataType.singleLineText,
  properties: {},
  required: true,
};

const EXAMPLE_ENTITY = {
  name: EXAMPLE_ENTITY_NAME,
  fields: [EXAMPLE_FIELD],
};

const EXAMPLE_OTHER_ENTITY = {
  name: EXAMPLE_OTHER_ENTITY_NAME,
  fields: [EXAMPLE_FIELD],
};

const EXAMPLE_DATA_SOURCE: PrismaSchemaDSL.DataSource = {
  name: "exampleDataSource",
  provider: PrismaSchemaDSL.DataSourceProvider.SQLite,
  url: "file://./example.db",
};

const DATA_SOURCE_CODE = `datasource ${EXAMPLE_DATA_SOURCE.name} {
  provider = "${EXAMPLE_DATA_SOURCE.provider}"
  url      = "${EXAMPLE_DATA_SOURCE.url}"
}`;

const HEADER = [DATA_SOURCE_CODE, GENERATOR_CODE, USER_MODEL_CODE].join("\n\n");

describe("createPrismaSchema", () => {
  const cases: Array<[string, PrismaSchemaDSL.DataSource, Entity[], string]> = [
    ["Empty", EXAMPLE_DATA_SOURCE, [], HEADER],
    [
      "Single model",
      EXAMPLE_DATA_SOURCE,
      [EXAMPLE_ENTITY],
      `${HEADER}

model ${EXAMPLE_ENTITY_NAME} {
  ${EXAMPLE_ENTITY_FIELD_NAME} String
}`,
    ],
    [
      "Two models",
      EXAMPLE_DATA_SOURCE,
      [EXAMPLE_ENTITY, EXAMPLE_OTHER_ENTITY],
      `${HEADER}

model ${EXAMPLE_ENTITY_NAME} {
  ${EXAMPLE_ENTITY_FIELD_NAME} String
}

model ${EXAMPLE_OTHER_ENTITY_NAME} {
  ${EXAMPLE_ENTITY_FIELD_NAME} String
}`,
    ],
  ];
  test.each(cases)(
    "%s",
    async (
      name,
      dataSource: PrismaSchemaDSL.DataSource,
      entities: Entity[],
      expected: string
    ) => {
      const schema = await createPrismaSchema(dataSource, entities);
      expect(schema).toBe(expected);
    }
  );
});

//   test("Single string field", () => {
//     const schema = createPrismaSchema(EXAMPLE_DATA_SOURCE, [
//       ENTITY_WITH_SINGLE_LINE_TEXT_FIELD,
//     ]);
//     expect(schema).toBe(
//       `
// generator client {
//   provider = "prisma-client-js"
// }

// datasource ${EXAMPLE_DATA_SOURCE.name} {
//   provider = "${EXAMPLE_DATA_SOURCE.provider}"
//   url      = "${EXAMPLE_DATA_SOURCE.url}"
// }

// model User {
//   ${ID_FIELD}
//   username String @unique
//   password String
// }

// model ${EXAMPLE_ENTITY_NAME} {
// \t${ID_FIELD}
// \t${EXAMPLE_ENTITY_FIELD_NAME} ${EnumPrismaScalarType.String}
// }
//   `.trim()
//     );
//   });
// });
