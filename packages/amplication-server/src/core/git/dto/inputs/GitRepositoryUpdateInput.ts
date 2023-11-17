import { Field, InputType } from "@nestjs/graphql";

@InputType()
class GitRepositoryUpdateInput {
  @Field(() => String, {
    nullable: true,
  })
  baseBranchName?: string | null;
}

export { GitRepositoryUpdateInput };
