import { print } from "@amplication/code-gen-utils";
import { Entity } from "@amplication/code-gen-types";
import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_SINGLE_LINE_TEXT_FIELD,
} from "../../../util/test-data";
import { createUpdateArgs, createUpdateArgsId } from "./create-update-args";
import { createEntityInputFiles } from "../../../create-dtos";

const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  name: "ExampleEntity",
  displayName: "Example Entity",
  pluralDisplayName: "Example Entities",
  pluralName: "ExampleEntities",
  fields: [EXAMPLE_ID_FIELD, EXAMPLE_SINGLE_LINE_TEXT_FIELD],
  permissions: [],
};
const EXAMPLE_DTO_ENTITY = createEntityInputFiles(EXAMPLE_ENTITY);
const EXAMPLE_WHERE_UNIQUE_INPUT = EXAMPLE_DTO_ENTITY.whereUniqueInput;
const EXAMPLE_UPDATE_INPUT = EXAMPLE_DTO_ENTITY.updateInput;
const EXAMPLE_ENTITY_WITHOUT_EDITABLE_FIELDS: Entity = {
  id: "EXAMPLE_ENTITY_WITHOUT_CREATABLE_FIELDS_ID",
  name: "ExampleEntityWithoutCreatableFields",
  displayName: "Example Entity Without Creatable Fields",
  pluralName: "ExampleEntities",
  pluralDisplayName: "Example Entities Without Creatable Fields",
  fields: [EXAMPLE_ID_FIELD],
  permissions: [],
};
const EXAMPLE_UPDATE_INPUT_WITHOUT_CREATABLE_FIELDS_DTO =
  createEntityInputFiles(EXAMPLE_ENTITY_WITHOUT_EDITABLE_FIELDS);
const EXAMPLE_UPDATE_INPUT_WITHOUT_CREATABLE_FIELDS =
  EXAMPLE_UPDATE_INPUT_WITHOUT_CREATABLE_FIELDS_DTO.updateInput;

describe("createUpdateArgs", () => {
  test("creates update args", async () => {
    const updateArgs = await createUpdateArgs(
      EXAMPLE_ENTITY,
      EXAMPLE_WHERE_UNIQUE_INPUT,
      EXAMPLE_UPDATE_INPUT
    );
    expect(updateArgs && print(updateArgs).code).toEqual(`@ArgsType()
class ${createUpdateArgsId(EXAMPLE_ENTITY.name).name} {
  @ApiProperty({
    required: true,
    type: () => ${EXAMPLE_WHERE_UNIQUE_INPUT.id.name},
  })
  @ValidateNested()
  @Type(() => ${EXAMPLE_WHERE_UNIQUE_INPUT.id.name})
  @Field(() => ${EXAMPLE_WHERE_UNIQUE_INPUT.id.name}, { nullable: false })
  where!: ${EXAMPLE_WHERE_UNIQUE_INPUT.id.name};

  @ApiProperty({
    required: true,
    type: () => ${EXAMPLE_UPDATE_INPUT.id.name},
  })
  @ValidateNested()
  @Type(() => ${EXAMPLE_UPDATE_INPUT.id.name})
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
