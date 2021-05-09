import { print } from "recast";
import { Entity } from "../../../../../types";
import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_SINGLE_LINE_TEXT_FIELD,
} from "../../../util/test-data";
import { createWhereInput } from "../../create-where-input";
import { createOrderByInput } from "../../graphql/order-by-input/order-by-input";
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
    const EXAMPLE_ORDER_BY_INPUT = await createOrderByInput(EXAMPLE_ENTITY);

    expect(
      print(
        await createFindManyArgs(
          EXAMPLE_ENTITY,
          EXAMPLE_WHERE_INPUT,
          EXAMPLE_ORDER_BY_INPUT
        )
      ).code
    ).toEqual(`@ArgsType()
class ${createFindManyArgsId(EXAMPLE_ENTITY.name).name} {
  @ApiProperty({
    required: false,
    type: () => ${EXAMPLE_WHERE_INPUT.id.name},
  })
  @Field(() => ${EXAMPLE_WHERE_INPUT.id.name}, { nullable: true })
  @Type(() => ${EXAMPLE_WHERE_INPUT.id.name})
  where?: ${EXAMPLE_WHERE_INPUT.id.name};

  @ApiProperty({
    required: false,
    type: ${EXAMPLE_ORDER_BY_INPUT.id.name},
  })
  @Field(() => ${EXAMPLE_ORDER_BY_INPUT.id.name}, { nullable: true })
  @Type(() => ${EXAMPLE_ORDER_BY_INPUT.id.name})
  orderBy?: ${EXAMPLE_ORDER_BY_INPUT.id.name};

  @ApiProperty({
    required: false,
    type: Number,
  })
  @Field(() => Number, { nullable: true })
  @Type(() => Number)
  skip?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @Field(() => Number, { nullable: true })
  @Type(() => Number)
  take?: number;
}`);
  });
});
