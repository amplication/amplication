import { GitOAuth2FlowInput } from "../inputs/GitOAuth2FlowInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CompleteGitOAuth2FlowArgs {
  @Field(() => GitOAuth2FlowInput, { nullable: false })
  data!: GitOAuth2FlowInput;
}
