import { ArgsType, Field } from '@nestjs/graphql';
import { RepoCreateInput } from '../inputs/CreateRepo';
import { BaseGitArgs } from './BaseGitArgs';

@ArgsType()
export class CreateRepoArgs extends BaseGitArgs {
  @Field(() => RepoCreateInput, { nullable: false })
  input: RepoCreateInput;
}
