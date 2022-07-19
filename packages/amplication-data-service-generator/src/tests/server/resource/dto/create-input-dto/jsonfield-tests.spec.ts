import { cloneDeep } from "lodash";
import { createCreateInput } from "../../../../../server/resource/dto/create-create-input";
import { Entity, EntityField } from "../../../../../types";
import defaultEntity from "../constants/default-entity";
import defaultJsonField from "../constants/json-field";
import { printTypescript } from "../utils";

describe("Testing the <Entity>CreateInput class with json field", () => {
  let entity: Entity;
  beforeEach(() => {
    entity = cloneDeep(defaultEntity);
  });
  it("should be a json field with ts type InputJsonValue", () => {
    const falseJsonFiled: EntityField = {
      ...cloneDeep(defaultJsonField),
      searchable: false,
      required: false,
      unique: false,
    };
    entity.fields = [falseJsonFiled];
    const code = printTypescript(createCreateInput(entity));
    expect(code).toMatchInlineSnapshot(`
"@InputType()
class ClassNameCreateInput {
  @ApiProperty({
    required: false,
  })
  @IsJSON()
  @IsOptional()
  @Field(() => GraphQLJSONObject, {
    nullable: true,
  })
  JsonFieldName?: InputJsonValue;
}
"
`);
  });
});
