import { print } from "recast";
import { builders } from "ast-types";
import { Entity, EntityField, EnumDataType } from "../../types";
import { createCreateInput } from "../dto/create-dto";
import { CONNECT_ID, createDataMapping, DATA_ID } from "./create-data-mapping";

const EXAMPLE_OTHER_ENTITY_ID = "EXAMPLE_OTHER_ENTITY_ID";
const EXAMPLE_ENTITY_FIELD: EntityField = {
  name: "exampleEntityFieldName",
  displayName: "Example Entity Field Display Name",
  description: "Example entity field description",
  dataType: EnumDataType.Id,
  required: true,
  searchable: false,
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
const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  name: "ExampleEntityName",
  displayName: "Example Entity",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ENTITY_FIELD],
  permissions: [],
};
const EXAMPLE_ENTITY_WITH_LOOKUP_FIELD: Entity = {
  id: "EXAMPLE_ENTITY_WITH_LOOKUP_FIELD_ID",
  name: "ExampleEntityWithLookupField",
  displayName: "Example Entity With Lookup Field",
  pluralDisplayName: "Example Entities With Lookup Field",
  fields: [EXAMPLE_ENTITY_LOOKUP_FIELD],
  permissions: [],
};

const EXAMPLE_ENTITY_ID_TO_NAME: Record<string, string> = {
  [EXAMPLE_OTHER_ENTITY_ID]: "ExampleOtherEntityName",
};

describe("createDataMapping", () => {
  test("does nothing if there are no object properties", () => {
    const dto = createCreateInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME);
    expect(createDataMapping(EXAMPLE_ENTITY, dto)).toBe(DATA_ID);
  });
  test("creates mapping of object properties", () => {
    const dto = createCreateInput(
      EXAMPLE_ENTITY_WITH_LOOKUP_FIELD,
      EXAMPLE_ENTITY_ID_TO_NAME
    );
    const [property] = dto.body.body;
    expect(createDataMapping(EXAMPLE_ENTITY, dto)).toEqual(
      builders.objectExpression([
        builders.spreadElement(DATA_ID),
        builders.property(
          "init",
          // @ts-ignore
          property.key,
          builders.objectExpression([
            builders.property(
              "init",
              CONNECT_ID,
              // @ts-ignore
              builders.memberExpression(DATA_ID, property.key)
            ),
          ])
        ),
      ])
    );
  });
});
