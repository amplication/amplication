import { ArgsType, Field } from "@nestjs/graphql";
import { CompleteAuthorizeResourceWithGithubInput } from "./CompleteAuthorizeResourceWithGithubInput";

@ArgsType()
export class CompleteAuthorizeResourceWithGithubArgs {
  @Field(() => CompleteAuthorizeResourceWithGithubInput, { nullable: false })
  data!: CompleteAuthorizeResourceWithGithubInput;
}
