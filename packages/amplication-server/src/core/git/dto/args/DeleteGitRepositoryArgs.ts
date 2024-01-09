import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class DeleteGitRepositoryArgs {
  @Field(() => String, { nullable: false })
  gitRepositoryId!: string;
}
