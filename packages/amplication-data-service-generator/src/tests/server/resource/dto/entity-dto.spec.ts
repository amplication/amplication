import cloneDeep from "lodash.clonedeep";
import { createEntityDTO } from "../../../../server/resource/dto/create-entity-dto";
import { Entity, EntityField } from "../../../../types";
import defaultEntity from "./constants/default-entity";
import defaultJsonField from "./constants/json-field";
import { printTypescript } from "./utils";

describe("Test that the entity dto is creating properly", () => {
  let entity: Entity;
  beforeEach(() => {
    entity = cloneDeep(defaultEntity);
  });
  /**
   * When the dto is entity the json field is must be required at all time
   */
  describe("Testing the json field mutations", () => {
    test("Testing entity json field with all true", () => {
      const trueJsonFiled: EntityField = {
        ...cloneDeep(defaultJsonField),
        searchable: true,
        required: true,
        unique: true,
      };
      entity.fields = [trueJsonFiled];
      const code = printTypescript(createEntityDTO(entity));
      expect(code).toMatchInlineSnapshot(`
"@ObjectType()
class ClassName {
  @IsJSON()
  @Field(() => GraphQLJSONObject)
  @ApiProperty({
    required: true,
  })
  JsonFieldName!: JsonValue;
}
"
`);
    });
    it("should return the same class as if all properties was true", () => {
      const falseJsonFiled: EntityField = {
        ...cloneDeep(defaultJsonField),
        searchable: false,
        required: false,
        unique: false,
      };
      entity.fields = [falseJsonFiled];
      const code = printTypescript(createEntityDTO(entity));
      expect(code).toMatchInlineSnapshot(`
"@ObjectType()
class ClassName {
  @IsJSON()
  @IsOptional()
  @Field(() => GraphQLJSONObject, {
    nullable: true,
  })
  @ApiProperty({
    required: false,
  })
  JsonFieldName!: JsonValue;
}
"
`);
    });
  });
});
