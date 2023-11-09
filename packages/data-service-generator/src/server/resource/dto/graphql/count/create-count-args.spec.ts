import { print } from "@amplication/code-gen-utils";
import { Entity } from "@amplication/code-gen-types";
import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_SINGLE_LINE_TEXT_FIELD,
} from "../../../util/test-data";
import { createCountArgs, createCountArgsId } from "./create-count-args";
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
const EXAMPLE_WHERE_INPUT = createEntityInputFiles(EXAMPLE_ENTITY);
const exampleWhereInput = EXAMPLE_WHERE_INPUT.whereInput;

describe("createCountArgs", () => {
  test("creates count args", async () => {
    expect(print(await createCountArgs(EXAMPLE_ENTITY, exampleWhereInput)).code)
      .toEqual(`@ArgsType()
class ${createCountArgsId(EXAMPLE_ENTITY.name).name} {
  @ApiProperty({
    required: false,
    type: () => ${exampleWhereInput.id.name},
  })
  @Field(() => ${exampleWhereInput.id.name}, { nullable: true })
  @Type(() => ${exampleWhereInput.id.name})
  where?: ${exampleWhereInput.id.name};
}`);
  });
});
