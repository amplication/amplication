import {
  createPrismaSchema,
  CLIENT_GENERATOR,
  DATA_SOURCE,
} from "./create-prisma-schema";
import { EnumDataType, EntityField } from "../models";
import { EntityWithFields } from "../types";

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
const EXAMPLE_APP_ID = "exampleAppId";

const EXAMPLE_FIELD: EntityField = {
  name: EXAMPLE_ENTITY_FIELD_NAME,
  dataType: EnumDataType.SingleLineText,
  properties: {},
  required: true,
  createdAt: new Date(),
  description: "",
  displayName: "Example Field",
  id: "exampleEntityFieldId",
  fieldPermanentId: "exampleEntityFieldPermanentId",
  searchable: true,
  updatedAt: new Date(),
};

const EXAMPLE_ENTITY: EntityWithFields = {
  id: "exampleEntityId",
  createdAt: new Date(),
  updatedAt: new Date(),
  displayName: "Example Entity",
  pluralDisplayName: "Example",
  isPersistent: true,
  allowFeedback: false,
  name: EXAMPLE_ENTITY_NAME,
  fields: [EXAMPLE_FIELD],
  appId: EXAMPLE_APP_ID,
  entityVersions: [],
};

const EXAMPLE_OTHER_ENTITY: EntityWithFields = {
  id: "exampleOtherEntityId",
  createdAt: new Date(),
  updatedAt: new Date(),
  displayName: "Example Other Entity",
  pluralDisplayName: "Example Other Entities",
  isPersistent: true,
  allowFeedback: false,
  name: EXAMPLE_OTHER_ENTITY_NAME,
  fields: [EXAMPLE_FIELD],
  appId: EXAMPLE_APP_ID,
  entityVersions: [],
};

const DATA_SOURCE_CODE = `datasource ${DATA_SOURCE.name} {
  provider = "${DATA_SOURCE.provider}"
  url      = env("${DATA_SOURCE.url.name}")
}`;

const HEADER = [DATA_SOURCE_CODE, GENERATOR_CODE, USER_MODEL_CODE].join("\n\n");

describe("createPrismaSchema", () => {
  const cases: Array<[string, EntityWithFields[], string]> = [
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
  ];
  test.each(cases)(
    "%s",
    async (name, entities: EntityWithFields[], expected: string) => {
      const schema = await createPrismaSchema(entities);
      expect(schema).toBe(expected);
    }
  );
});
