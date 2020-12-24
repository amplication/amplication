import { print } from "recast";
import { Entity, EntityField, EnumDataType } from "../../../../../types";
import { createWhereUniqueInput } from "../../create-where-unique-input";
import { createDeleteArgs, createDeleteArgsId } from "./create-delete-args";

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
const EXAMPLE_WHERE_UNIQUE_INPUT = createWhereUniqueInput(EXAMPLE_ENTITY, {});

describe("createDeleteArgs", () => {
  test("creates delete args", async () => {
    expect(
      print(await createDeleteArgs(EXAMPLE_ENTITY, EXAMPLE_WHERE_UNIQUE_INPUT))
        .code
    ).toEqual(`@ArgsType()
class ${createDeleteArgsId(EXAMPLE_ENTITY.name).name} {
  @Field(() => ${EXAMPLE_WHERE_UNIQUE_INPUT.id.name}, { nullable: false })
  where!: ${EXAMPLE_WHERE_UNIQUE_INPUT.id.name};
}`);
  });
});
