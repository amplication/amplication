import { print } from "@amplication/code-gen-utils";
import { Entity } from "@amplication/code-gen-types";
import { createWhereUniqueInput } from "../../create-where-unique-input";
import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_SINGLE_LINE_TEXT_FIELD,
} from "../../../util/test-data";
import { createDeleteArgs, createDeleteArgsId } from "./create-delete-args";

const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  name: "ExampleEntity",
  displayName: "Example Entity",
  pluralName: "ExampleEntities",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ID_FIELD, EXAMPLE_SINGLE_LINE_TEXT_FIELD],
  permissions: [],
};
const EXAMPLE_WHERE_UNIQUE_INPUT = createWhereUniqueInput(EXAMPLE_ENTITY);

describe("createDeleteArgs", () => {
  test("creates delete args", async () => {
    expect(
      print(await createDeleteArgs(EXAMPLE_ENTITY, EXAMPLE_WHERE_UNIQUE_INPUT))
        .code
    ).toEqual(`@ArgsType()
class ${createDeleteArgsId(EXAMPLE_ENTITY.name).name} {
  @ApiProperty({
    required: true,
    type: () => ${EXAMPLE_WHERE_UNIQUE_INPUT.id.name},
  })
  @ValidateNested()
  @Type(() => ${EXAMPLE_WHERE_UNIQUE_INPUT.id.name})
  @Field(() => ${EXAMPLE_WHERE_UNIQUE_INPUT.id.name}, { nullable: false })
  where!: ${EXAMPLE_WHERE_UNIQUE_INPUT.id.name};
}`);
  });
});
