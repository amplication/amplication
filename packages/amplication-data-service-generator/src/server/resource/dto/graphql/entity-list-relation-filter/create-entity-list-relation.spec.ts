import { EntityField } from "../../../../../types";
import { createWhereInput } from "../../create-where-input";
import {
  createEntityListRelationFilter,
  createEntityListRelationFilterID,
} from "./create-entity-list-relation-filter";
import { printTypescript } from "../../../../../tests/server/resource/dto/utils";
import cloneDeep from "lodash.clonedeep";
import defaultEntity from "../../../../../tests/server/resource/dto/constants/default-entity";
import defaultJsonField from "../../../../../tests/server/resource/dto/constants/json-field";

describe("Testing the creation of createEntityListRelation", () => {
  const entity = cloneDeep(defaultEntity);
  test("Testing entity json field with all true", async () => {
    const trueJsonFiled: EntityField = {
      ...cloneDeep(defaultJsonField),
      searchable: true,
      required: true,
      unique: true,
    };
    entity.fields = [trueJsonFiled];
    const whereInput = createWhereInput(entity);
    const code = printTypescript(
      await createEntityListRelationFilter(entity, whereInput)
    );
    // eslint-disable-next-line jest/no-interpolation-in-snapshots
    expect(code).toMatchInlineSnapshot(`
"@InputType()
class ${createEntityListRelationFilterID(entity.name).name} {
  @ApiProperty({
    required: false,
    type: () => ${whereInput.id.name},
  })
  @ValidateNested()
  @Type(() => ${whereInput.id.name})
  @IsOptional()
  @Field(() => ${whereInput.id.name}, {
    nullable: true,
  })
  every?: ${whereInput.id.name};

  @ApiProperty({
    required: false,
    type: () => ${whereInput.id.name},
  })
  @ValidateNested()
  @Type(() => ${whereInput.id.name})
  @IsOptional()
  @Field(() => ${whereInput.id.name}, {
    nullable: true,
  })
  some?: ${whereInput.id.name};

  @ApiProperty({
    required: false,
    type: () => ${whereInput.id.name},
  })
  @ValidateNested()
  @Type(() => ${whereInput.id.name})
  @IsOptional()
  @Field(() => ${whereInput.id.name}, {
    nullable: true,
  })
  none?: ${whereInput.id.name};
}
"
`);
  });
});
