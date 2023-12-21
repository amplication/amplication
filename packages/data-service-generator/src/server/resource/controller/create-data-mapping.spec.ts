import { builders } from "ast-types";
import { Entity } from "@amplication/code-gen-types";
import { EXAMPLE_ID_FIELD, EXAMPLE_LOOKUP_FIELD } from "../util/test-data";
import { CONNECT_ID, createDataMapping } from "./create-data-mapping";
import { createEntityInputFiles } from "../create-dtos";

const DATA_ID = builders.identifier("data");

const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  name: "ExampleEntityName",
  displayName: "Example Entity",
  pluralName: "ExampleEntities",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ID_FIELD],
  permissions: [],
};
const EXAMPLE_ENTITY_WITH_LOOKUP_FIELD: Entity = {
  id: "EXAMPLE_ENTITY_WITH_LOOKUP_FIELD_ID",
  name: "ExampleEntityWithLookupField",
  displayName: "Example Entity With Lookup Field",
  pluralName: "ExampleEntities",
  pluralDisplayName: "Example Entities With Lookup Field",
  fields: [EXAMPLE_LOOKUP_FIELD],
  permissions: [],
};

describe("createDataMapping", () => {
  test("does nothing if there are no object properties", () => {
    const dto = createEntityInputFiles(EXAMPLE_ENTITY).createInput;
    expect(createDataMapping(EXAMPLE_ENTITY, dto, DATA_ID)).toBe(DATA_ID);
  });
  test("creates mapping of object properties", () => {
    const dto = createEntityInputFiles(
      EXAMPLE_ENTITY_WITH_LOOKUP_FIELD
    ).createInput;
    const [property] = dto.body.body;
    expect(
      createDataMapping(EXAMPLE_ENTITY_WITH_LOOKUP_FIELD, dto, DATA_ID)
    ).toEqual(
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
