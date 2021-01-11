import { ArgsType, Field } from '@nestjs/graphql';
import { AppEnableSyncWithGithubRepoInput } from './AppEnableSyncWithGithubRepoInput';
import { WhereUniqueInput } from 'src/dto/';

@ArgsType()
export class AppEnableSyncWithGithubRepoArgs {
  @Field(() => AppEnableSyncWithGithubRepoInput, { nullable: false })
  data!: AppEnableSyncWithGithubRepoInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
