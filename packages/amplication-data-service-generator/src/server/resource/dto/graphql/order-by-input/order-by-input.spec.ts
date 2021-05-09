import { print } from "recast";
import { Entity } from "../../../../../types";
import { createCreateInput } from "../../create-create-input";
import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_SINGLE_LINE_TEXT_FIELD,
} from "../../../util/test-data";
import { createOrderByInputId, createOrderByInput } from "./order-by-input";

const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  name: "ExampleEntity",
  displayName: "Example Entity",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ID_FIELD, EXAMPLE_SINGLE_LINE_TEXT_FIELD],
  permissions: [],
};
const EXAMPLE_CREATE_INPUT = createCreateInput(EXAMPLE_ENTITY);
const EXAMPLE_ENTITY_WITHOUT_EDITABLE_FIELDS: Entity = {
  id: "EXAMPLE_ENTITY_WITHOUT_CREATABLE_FIELDS_ID",
  name: "ExampleEntityWithoutCreatableFields",
  displayName: "Example Entity Without Creatable Fields",
  pluralDisplayName: "Example Entities Without Creatable Fields",
  fields: [EXAMPLE_ID_FIELD],
  permissions: [],
};
const EXAMPLE_CREATE_INPUT_WITHOUT_CREATABLE_FIELDS = createCreateInput(
  EXAMPLE_ENTITY_WITHOUT_EDITABLE_FIELDS
);

describe("createOrderByInput", () => {
  test("creates order by input", async () => {
    const createInput = await createOrderByInput(EXAMPLE_ENTITY);
    console.log(print(createInput).code);
    expect(createInput && print(createInput).code).toEqual(`@InputType({
  isAbstract: true,
  description: undefined,
})
class ExampleEntityOrderByInput {
    @ApiProperty({
    required: false,
    enum: ["Asc", "Desc"]
})
@Field(() => SortOrder, {
    nullable: true
})
    ${EXAMPLE_ID_FIELD.name}?: SortOrder

    @ApiProperty({
    required: false,
    enum: ["Asc", "Desc"]
})
@Field(() => SortOrder, {
    nullable: true
})
    ${EXAMPLE_SINGLE_LINE_TEXT_FIELD.name}?: SortOrder
}`);
  });
});
