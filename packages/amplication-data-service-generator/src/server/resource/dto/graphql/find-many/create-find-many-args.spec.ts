import { print } from "recast";
import { Entity } from "../../../../../types";
import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_SINGLE_LINE_TEXT_FIELD,
} from "../../../util/test-data";
import { createWhereInput } from "../../create-where-input";
import {
  createFindManyArgs,
  createFindManyArgsId,
} from "./create-find-many-args";

const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  name: "ExampleEntity",
  displayName: "Example Entity",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ID_FIELD, EXAMPLE_SINGLE_LINE_TEXT_FIELD],
  permissions: [],
};
const EXAMPLE_WHERE_INPUT = createWhereInput(EXAMPLE_ENTITY);

describe("createFindManyArgs", () => {
  test("creates find many args", async () => {
    expect(
      print(await createFindManyArgs(EXAMPLE_ENTITY, EXAMPLE_WHERE_INPUT)).code
    ).toEqual(`@ArgsType()
class ${createFindManyArgsId(EXAMPLE_ENTITY.name).name} {
  @Field(() => ${EXAMPLE_WHERE_INPUT.id.name}, { nullable: true })
  where?: ${EXAMPLE_WHERE_INPUT.id.name};
}`);
  });
});
