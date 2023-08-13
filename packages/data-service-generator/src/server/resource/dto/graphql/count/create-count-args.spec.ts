import { print } from "@amplication/code-gen-utils";
import { Entity } from "@amplication/code-gen-types";
import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_SINGLE_LINE_TEXT_FIELD,
} from "../../../util/test-data";
import { createWhereInput } from "../../create-where-input";
import { createCountArgs, createCountArgsId } from "./create-count-args";

const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  name: "ExampleEntity",
  displayName: "Example Entity",
  pluralName: "ExampleEntities",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ID_FIELD, EXAMPLE_SINGLE_LINE_TEXT_FIELD],
  permissions: [],
};
const EXAMPLE_WHERE_INPUT = createWhereInput(EXAMPLE_ENTITY);

describe("createCountArgs", () => {
  test("creates count args", async () => {
    expect(
      print(await createCountArgs(EXAMPLE_ENTITY, EXAMPLE_WHERE_INPUT)).code
    ).toEqual(`@ArgsType()
class ${createCountArgsId(EXAMPLE_ENTITY.name).name} {
  @ApiProperty({
    required: false,
    type: () => ${EXAMPLE_WHERE_INPUT.id.name},
  })
  @Field(() => ${EXAMPLE_WHERE_INPUT.id.name}, { nullable: true })
  @Type(() => ${EXAMPLE_WHERE_INPUT.id.name})
  where?: ${EXAMPLE_WHERE_INPUT.id.name};
}`);
  });
});
