import { print } from "recast";
import { Entity } from "../../../../../types";
import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_SINGLE_LINE_TEXT_FIELD,
} from "../../../util/test-data";
import { createUpdateInput } from "../../create-update-input";
import { createWhereUniqueInput } from "../../create-where-unique-input";
import { createUpdateArgs, createUpdateArgsId } from "./create-update-args";

const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  name: "ExampleEntity",
  displayName: "Example Entity",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ID_FIELD, EXAMPLE_SINGLE_LINE_TEXT_FIELD],
  permissions: [],
};
const EXAMPLE_WHERE_UNIQUE_INPUT = createWhereUniqueInput(EXAMPLE_ENTITY);
const EXAMPLE_UPDATE_INPUT = createUpdateInput(EXAMPLE_ENTITY);
const EXAMPLE_ENTITY_WITHOUT_EDITABLE_FIELDS: Entity = {
  id: "EXAMPLE_ENTITY_WITHOUT_CREATABLE_FIELDS_ID",
  name: "ExampleEntityWithoutCreatableFields",
  displayName: "Example Entity Without Creatable Fields",
  pluralDisplayName: "Example Entities Without Creatable Fields",
  fields: [EXAMPLE_ID_FIELD],
  permissions: [],
};
const EXAMPLE_UPDATE_INPUT_WITHOUT_CREATABLE_FIELDS = createUpdateInput(
  EXAMPLE_ENTITY_WITHOUT_EDITABLE_FIELDS
);

describe("createUpdateArgs", () => {
  test("creates update args", async () => {
    const updateArgs = await createUpdateArgs(
      EXAMPLE_ENTITY,
      EXAMPLE_WHERE_UNIQUE_INPUT,
      EXAMPLE_UPDATE_INPUT
    );
    expect(updateArgs && print(updateArgs).code).toEqual(`@ArgsType()
class ${createUpdateArgsId(EXAMPLE_ENTITY.name).name} {
  @Field(() => ${EXAMPLE_WHERE_UNIQUE_INPUT.id.name}, { nullable: false })
  where!: ${EXAMPLE_WHERE_UNIQUE_INPUT.id.name};
  @Field(() => ${EXAMPLE_UPDATE_INPUT.id.name}, { nullable: false })
  data!: ${EXAMPLE_UPDATE_INPUT.id.name};
}`);
  });
  test("does not create update args if input is not graphql input", async () => {
    const updateArgs = await createUpdateArgs(
      EXAMPLE_ENTITY_WITHOUT_EDITABLE_FIELDS,
      EXAMPLE_WHERE_UNIQUE_INPUT,
      EXAMPLE_UPDATE_INPUT_WITHOUT_CREATABLE_FIELDS
    );
    expect(updateArgs).toBe(null);
  });
});
