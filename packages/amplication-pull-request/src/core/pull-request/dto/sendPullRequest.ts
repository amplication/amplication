import { ArgsType, Field, registerEnumType } from '@nestjs/graphql';
import { EnumGitProvider } from 'src/models';

registerEnumType(EnumGitProvider, {
  name: 'EnumGitProvider',
});

@ArgsType()
export class SendPullRequestArgs {
  @Field(() => String, { nullable: false })
  amplicationAppId!: string;
  @Field(() => String, { nullable: false })
  oldBuildId!: string;
  @Field(() => String, { nullable: false })
  newBuildId!: string;
  @Field(() => String, { nullable: false })
  installationId!: string;
  @Field(() => EnumGitProvider, { nullable: false })
  gitProvider!: EnumGitProvider;
  // @Field(() => GitOrganization, { nullable: false })
  // gitOrganization: GitOrganization;
  // gitRepository: GitRepository;
}
