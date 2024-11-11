import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class OwnershipWhereInput {
  @Field(() => String, { nullable: true })
  userId?: string | null;

  @Field(() => String, { nullable: true })
  teamId?: string | null;
}
