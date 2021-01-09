import { ArgsType, Field } from '@nestjs/graphql';
import { AvailableGithubReposFindInput } from './AvailableGithubReposFindInput';

@ArgsType()
export class FindAvailableGithubReposArgs {
  @Field(() => AvailableGithubReposFindInput, { nullable: false })
  where!: AvailableGithubReposFindInput;
}
