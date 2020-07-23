import { createPrismaSchema, ID_FIELD } from "./prisma-generator";
import {
  EnumDataType,
  EnumPrismaScalarType,
  PrismaDataSource,
  EnumPrismaDataSourceProvider,
} from "./types";

const EXAMPLE_ENTITY_NAME = "foo";
const EXAMPLE_ENTITY_FIELD_NAME = "bar";
const ENTITY_WITH_SINGLE_LINE_TEXT_FIELD = {
  name: EXAMPLE_ENTITY_NAME,
  fields: [
    {
      name: EXAMPLE_ENTITY_FIELD_NAME,
      dataType: EnumDataType.singleLineText,
      properties: {},
      required: true,
    },
  ],
};
const EXAMPLE_DATA_SOURCE: PrismaDataSource = {
  provider: EnumPrismaDataSourceProvider.SQLite,
  url: "file://./example.db",
};

describe("createPrismaSchema", () => {
  test("Single string field", () => {
    const schema = createPrismaSchema(EXAMPLE_DATA_SOURCE, [
      ENTITY_WITH_SINGLE_LINE_TEXT_FIELD,
    ]);
    expect(schema).toBe(
      `
generator client {
  provider = "prisma-client-js"
}

datasource {
  provider = "sqlite"
  url      = "file://./example.db"
}

model ${EXAMPLE_ENTITY_NAME} {
\t${ID_FIELD}
\t${EXAMPLE_ENTITY_FIELD_NAME} ${EnumPrismaScalarType.String}
}
  `.trim()
    );
  });
});
