import { print } from "recast";
import { Entity } from "../../../../../types";
import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_SINGLE_LINE_TEXT_FIELD,
} from "../../../util/test-data";
import { createWhereInput } from "../../create-where-input";
import {
  createEntityListRelationFilter,
  createEntityListRelationFilterID,
} from "./create-entity-list-relation-filter";

const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  name: "ExampleEntity",
  displayName: "Example Entity",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ID_FIELD, EXAMPLE_SINGLE_LINE_TEXT_FIELD],
  permissions: [],
};
const EXAMPLE_WHERE_INPUT = createWhereInput(EXAMPLE_ENTITY);

describe("createEntityListRelation", () => {
  test("create list relation", async () => {
    expect(
      print(
        await createEntityListRelationFilter(
          EXAMPLE_ENTITY,
          EXAMPLE_WHERE_INPUT
        )
      ).code
    ).toEqual(`@InputType()
class ${createEntityListRelationFilterID(EXAMPLE_ENTITY.name).name} {
  @ApiProperty({
    required: false,
    type: () => ${EXAMPLE_WHERE_INPUT.id.name},
  })
  @ValidateNested()
  @Type(() => ${EXAMPLE_WHERE_INPUT.id.name})
  @IsOptional()
  @Field(() => ${EXAMPLE_WHERE_INPUT.id.name}, {
    nullable: true,
  })
  every?: ${EXAMPLE_WHERE_INPUT.id.name};

  @ApiProperty({
    required: false,
    type: () => ${EXAMPLE_WHERE_INPUT.id.name},
  })
  @ValidateNested()
  @Type(() => ${EXAMPLE_WHERE_INPUT.id.name})
  @IsOptional()
  @Field(() => ${EXAMPLE_WHERE_INPUT.id.name}, {
    nullable: true,
  })
  some?: ${EXAMPLE_WHERE_INPUT.id.name};

  @ApiProperty({
    required: false,
    type: () => ${EXAMPLE_WHERE_INPUT.id.name},
  })
  @ValidateNested()
  @Type(() => ${EXAMPLE_WHERE_INPUT.id.name})
  @IsOptional()
  @Field(() => ${EXAMPLE_WHERE_INPUT.id.name}, {
    nullable: true,
  })
  none?: ${EXAMPLE_WHERE_INPUT.id.name};
}`);
  });
});
