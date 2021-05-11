import { ObjectType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";

@ObjectType()
class MetaQueryPayload {
  @ApiProperty({
    required: true,
  })
  @Field(() => String)
  count!: number;
}
export { MetaQueryPayload };
