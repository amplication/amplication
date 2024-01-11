import { ResourceWhereInput } from "./ResourceWhereInput";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class ResourceListRelationFilter {
  @Field(() => ResourceWhereInput, { nullable: true })
  every?: ResourceWhereInput;

  @Field(() => ResourceWhereInput, { nullable: true })
  some?: ResourceWhereInput;

  @Field(() => ResourceWhereInput, { nullable: true })
  none?: ResourceWhereInput;
}
