import { print } from "recast";
import { Entity, EntityField, EnumDataType } from "../../../../../types";
import { createCreateInput } from "../../create-create-input";
import { createCreateArgs, createCreateArgsId } from "./create-create-args";

const EXAMPLE_ID_FIELD: EntityField = {
  dataType: EnumDataType.Id,
  displayName: "ID",
  name: "id",
  required: true,
  searchable: false,
  properties: {},
  description: "The entity identifier",
};
const EXAMPLE_SINGLE_LINE_TEXT_FIELD: EntityField = {
  dataType: EnumDataType.SingleLineText,
  displayName: "Example Single Line Text Field",
  name: "exampleSingleLineTextField",
  required: true,
  searchable: false,
  properties: {},
  description: "Example Single Line Text Field Description",
};
const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  name: "ExampleEntity",
  displayName: "Example Entity",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ID_FIELD, EXAMPLE_SINGLE_LINE_TEXT_FIELD],
  permissions: [],
};
const EXAMPLE_CREATE_INPUT = createCreateInput(EXAMPLE_ENTITY, {});
const EXAMPLE_ENTITY_WITHOUT_EDITABLE_FIELDS: Entity = {
  id: "EXAMPLE_ENTITY_WITHOUT_CREATABLE_FIELDS_ID",
  name: "ExampleEntityWithoutCreatableFields",
  displayName: "Example Entity Without Creatable Fields",
  pluralDisplayName: "Example Entities Without Creatable Fields",
  fields: [EXAMPLE_ID_FIELD],
  permissions: [],
};
const EXAMPLE_CREATE_INPUT_WITHOUT_CREATABLE_FIELDS = createCreateInput(
  EXAMPLE_ENTITY_WITHOUT_EDITABLE_FIELDS,
  {}
);

describe("createCreateArgs", () => {
  test("creates create args", async () => {
    expect(
      print(await createCreateArgs(EXAMPLE_ENTITY, EXAMPLE_CREATE_INPUT)).code
    ).toEqual(`@ArgsType()
class ${createCreateArgsId(EXAMPLE_ENTITY.name).name} {
  @Field(() => ${EXAMPLE_CREATE_INPUT.id.name}, { nullable: false })
  data!: ${EXAMPLE_CREATE_INPUT.id.name};
}`);
  });
  test("creates create args without data if input is not graphql input", async () => {
    expect(
      print(
        await createCreateArgs(
          EXAMPLE_ENTITY_WITHOUT_EDITABLE_FIELDS,
          EXAMPLE_CREATE_INPUT_WITHOUT_CREATABLE_FIELDS
        )
      ).code
    ).toEqual(`@ArgsType()
class ${createCreateArgsId(EXAMPLE_ENTITY_WITHOUT_EDITABLE_FIELDS.name).name} {

}`);
  });
});
