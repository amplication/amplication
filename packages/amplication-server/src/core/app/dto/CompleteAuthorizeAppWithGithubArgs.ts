import { ArgsType, Field } from '@nestjs/graphql';
import { CompleteAuthorizeAppWithGithubInput } from './CompleteAuthorizeAppWithGithubInput';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class CompleteAuthorizeAppWithGithubArgs {
  @Field(() => CompleteAuthorizeAppWithGithubInput, { nullable: false })
  data!: CompleteAuthorizeAppWithGithubInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
