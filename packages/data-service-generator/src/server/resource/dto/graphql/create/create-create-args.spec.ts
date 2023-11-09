import { print } from "@amplication/code-gen-utils";
import { Entity } from "@amplication/code-gen-types";
import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_SINGLE_LINE_TEXT_FIELD,
} from "../../../util/test-data";
import { createCreateArgs, createCreateArgsId } from "./create-create-args";
import { createEntityInputFiles } from "../../../create-dtos";

const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  name: "ExampleEntity",
  displayName: "Example Entity",
  pluralName: "ExampleEntities",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ID_FIELD, EXAMPLE_SINGLE_LINE_TEXT_FIELD],
  permissions: [],
};
const EXAMPLE_CREATE_INPUT = createEntityInputFiles(EXAMPLE_ENTITY);
const exampleCreateInput = EXAMPLE_CREATE_INPUT.createInput;
const EXAMPLE_ENTITY_WITHOUT_EDITABLE_FIELDS: Entity = {
  id: "EXAMPLE_ENTITY_WITHOUT_CREATABLE_FIELDS_ID",
  name: "ExampleEntityWithoutCreatableFields",
  displayName: "Example Entity Without Creatable Fields",
  pluralName: "ExampleEntities",
  pluralDisplayName: "Example Entities Without Creatable Fields",
  fields: [EXAMPLE_ID_FIELD],
  permissions: [],
};

const EXAMPLE_CREATE_INPUT_WITHOUT_CREATABLE_FIELDS = createEntityInputFiles(
  EXAMPLE_ENTITY_WITHOUT_EDITABLE_FIELDS
);
const exampleCreateInputWithoutCreatableFields =
  EXAMPLE_CREATE_INPUT_WITHOUT_CREATABLE_FIELDS.createInput;

describe("createCreateArgs", () => {
  test("creates create args", async () => {
    const createArgs = await createCreateArgs(
      EXAMPLE_ENTITY,
      exampleCreateInput
    );
    expect(createArgs && print(createArgs).code).toEqual(`@ArgsType()
class ${createCreateArgsId(EXAMPLE_ENTITY.name).name} {
  @ApiProperty({
    required: true,
    type: () => ${exampleCreateInput.id.name},
  })
  @ValidateNested()
  @Type(() => ${exampleCreateInput.id.name})
  @Field(() => ${exampleCreateInput.id.name}, { nullable: false })
  data!: ${exampleCreateInput.id.name};
}`);
  });
  test("creates create args without data if input is not graphql input", async () => {
    const createArgs = await createCreateArgs(
      EXAMPLE_ENTITY_WITHOUT_EDITABLE_FIELDS,
      exampleCreateInputWithoutCreatableFields
    );
    expect(createArgs).toBe(null);
  });
});
