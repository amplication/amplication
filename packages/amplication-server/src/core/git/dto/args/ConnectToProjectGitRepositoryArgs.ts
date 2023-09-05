import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class ConnectToProjectGitRepositoryArgs {
  @Field(() => String, { nullable: false })
  resourceId!: string;
}
