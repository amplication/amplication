import { CompleteAuthorizeResourceWithGithubInput } from "./CompleteAuthorizeResourceWithGithubInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CompleteAuthorizeResourceWithGithubArgs {
  @Field(() => CompleteAuthorizeResourceWithGithubInput, { nullable: false })
  data!: CompleteAuthorizeResourceWithGithubInput;
}
