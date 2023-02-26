import { ArgsType, Field } from "@nestjs/graphql";
import { GitOAuth2FlowInput } from "../inputs/GitOAuth2FlowInput";

@ArgsType()
export class GetGitOAuth2FlowArgs {
  @Field(() => GitOAuth2FlowInput, { nullable: false })
  data!: GitOAuth2FlowInput;
}
