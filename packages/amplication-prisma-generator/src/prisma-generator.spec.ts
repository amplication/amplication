import { createPrismaSchema, ID_FIELD } from "./prisma-generator";
import { EnumDataType, EnumPrismaScalarType } from "./types";

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

describe("createPrismaSchema", () => {
  test("Single string field", () => {
    const schema = createPrismaSchema([ENTITY_WITH_SINGLE_LINE_TEXT_FIELD]);
    expect(schema).toBe(
      `
model ${EXAMPLE_ENTITY_NAME} {
\t${ID_FIELD}
\t${EXAMPLE_ENTITY_FIELD_NAME} ${EnumPrismaScalarType.String}
}
  `.trim()
    );
  });
});
