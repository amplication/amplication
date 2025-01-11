import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class CommitResourceVersionCreateInput {
  @Field(() => String, {
    nullable: true,
  })
  resourceId?: string;

  @Field(() => String, {
    nullable: true,
  })
  version?: string;
}
