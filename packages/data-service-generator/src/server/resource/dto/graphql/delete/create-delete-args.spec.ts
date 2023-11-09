import { print } from "@amplication/code-gen-utils";
import { Entity } from "@amplication/code-gen-types";

import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_SINGLE_LINE_TEXT_FIELD,
} from "../../../util/test-data";
import { createDeleteArgs, createDeleteArgsId } from "./create-delete-args";
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
const EXAMPLE_WHERE_UNIQUE_INPUT = createEntityInputFiles(EXAMPLE_ENTITY);
const ExampleWhereUniqueInput = EXAMPLE_WHERE_UNIQUE_INPUT.whereUniqueInput;

describe("createDeleteArgs", () => {
  test("creates delete args", async () => {
    expect(
      print(await createDeleteArgs(EXAMPLE_ENTITY, ExampleWhereUniqueInput))
        .code
    ).toEqual(`@ArgsType()
class ${createDeleteArgsId(EXAMPLE_ENTITY.name).name} {
  @ApiProperty({
    required: true,
    type: () => ${ExampleWhereUniqueInput.id.name},
  })
  @ValidateNested()
  @Type(() => ${ExampleWhereUniqueInput.id.name})
  @Field(() => ${ExampleWhereUniqueInput.id.name}, { nullable: false })
  where!: ${ExampleWhereUniqueInput.id.name};
}`);
  });
});
