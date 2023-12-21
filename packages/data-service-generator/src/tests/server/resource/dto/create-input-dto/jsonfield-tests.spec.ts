import { cloneDeep } from "lodash";
import { Entity, EntityField } from "@amplication/code-gen-types";
import defaultEntity from "../constants/default-entity";
import defaultJsonField from "../constants/json-field";
import { printTypescript } from "../utils";
import { createEntityInputFiles } from "../../../../../server/resource/create-dtos";

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
    const code = printTypescript(createEntityInputFiles(entity).createInput);
    expect(code).toMatchInlineSnapshot(`
      "@InputType()
      class ClassNameCreateInput {
        @ApiProperty({
          required: false,
        })
        @IsJSONValue()
        @IsOptional()
        @Field(() => GraphQLJSON, {
          nullable: true,
        })
        JsonFieldName?: InputJsonValue;
      }
      "
    `);
  });
});
