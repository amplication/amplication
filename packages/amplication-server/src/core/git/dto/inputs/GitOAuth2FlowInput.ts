import { EnumGitProvider } from "../enums/EnumGitProvider";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class GitOAuth2FlowInput {
  workspaceId!: string;

  @Field(() => EnumGitProvider, { nullable: false })
  gitProvider!: EnumGitProvider;

  @Field(() => String, { nullable: false })
  code!: string;
}
