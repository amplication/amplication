import { ArgsType, Field } from '@nestjs/graphql';
import { CompleteAuthorizeAppWithGithubInput } from './CompleteAuthorizeAppWithGithubInput';

@ArgsType()
export class CompleteAuthorizeAppWithGithubArgs {
  @Field(() => CompleteAuthorizeAppWithGithubInput, { nullable: false })
  data!: CompleteAuthorizeAppWithGithubInput;
}
