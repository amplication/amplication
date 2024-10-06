import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
class MetaQueryPayload {
  @Field(() => Number)
  count!: number;
}
export { MetaQueryPayload };
