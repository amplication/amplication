import { print } from "@amplication/code-gen-utils";
import { Entity } from "@amplication/code-gen-types";
import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_SINGLE_LINE_TEXT_FIELD,
} from "../../../util/test-data";
import { createOrderByInput } from "./order-by-input";

const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  name: "ExampleEntity",
  displayName: "Example Entity",
  pluralDisplayName: "Example Entities",
  pluralName: "ExampleEntities",
  fields: [EXAMPLE_ID_FIELD, EXAMPLE_SINGLE_LINE_TEXT_FIELD],
  permissions: [],
};

describe("createOrderByInput", () => {
  test("creates order by input", async () => {
    const createInput = await createOrderByInput(EXAMPLE_ENTITY);
    expect(createInput && print(createInput).code).toEqual(`@InputType({
  isAbstract: true,
  description: undefined,
})
class ExampleEntityOrderByInput {
    @ApiProperty({
    required: false,
    enum: ["asc", "desc"]
})
@IsOptional()
@IsEnum(SortOrder)
@Field(() => SortOrder, {
    nullable: true
})
    ${EXAMPLE_ID_FIELD.name}?: SortOrder

    @ApiProperty({
    required: false,
    enum: ["asc", "desc"]
})
@IsOptional()
@IsEnum(SortOrder)
@Field(() => SortOrder, {
    nullable: true
})
    ${EXAMPLE_SINGLE_LINE_TEXT_FIELD.name}?: SortOrder
}`);
  });
});
