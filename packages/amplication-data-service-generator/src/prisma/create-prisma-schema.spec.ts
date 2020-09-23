import {
  createPrismaSchema,
  CLIENT_GENERATOR,
  DATA_SOURCE,
} from "./create-prisma-schema";
import { Entity, EntityField, EnumDataType } from "../types";
import { getEntityIdToName } from "../util/entity";

const GENERATOR_CODE = `generator ${CLIENT_GENERATOR.name} {
  provider = "${CLIENT_GENERATOR.provider}"
}`;

const EXAMPLE_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_OTHER_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_ENTITY_FIELD_NAME = "ExampleEntityFieldName";
const EXAMPLE_LOOKUP_ENTITY_NAME = "ExampleLookupEntity";
const EXAMPLE_LOOKUP_FIELD_NAME = "exampleLookupField";

const EXAMPLE_FIELD: EntityField = {
  name: EXAMPLE_ENTITY_FIELD_NAME,
  dataType: EnumDataType.SingleLineText,
  properties: {},
  required: true,
  description: "",
  displayName: "Example Field",
  searchable: true,
};

const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  displayName: "Example Entity",
  pluralDisplayName: "Example",
  name: EXAMPLE_ENTITY_NAME,
  fields: [EXAMPLE_FIELD],
  permissions: [],
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
      dataType: EnumDataType.Lookup,
      required: true,
      searchable: false,
      name: EXAMPLE_LOOKUP_FIELD_NAME,
      displayName: "Example Lookup Field",
      properties: {
        relatedEntityId: EXAMPLE_ENTITY.id,
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
    const entityIdToName = getEntityIdToName(entities);
    const schema = await createPrismaSchema(entities, entityIdToName);
    expect(schema).toBe(expected);
  });
});
