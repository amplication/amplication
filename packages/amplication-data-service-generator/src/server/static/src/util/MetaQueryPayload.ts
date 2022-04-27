import { ObjectType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";

@ObjectType()
class MetaQueryPayload {
  @ApiProperty({
    required: true,
    type: [Number],
  })
  @Field(() => Number)
  count!: number;
}
export { MetaQueryPayload };
