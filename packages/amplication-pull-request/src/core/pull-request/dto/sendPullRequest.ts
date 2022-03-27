import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class SendPullRequestArgs {
  @Field(() => String, { nullable: false })
  amplicationAppId!: string;
  @Field(() => String, { nullable: false })
  previousAmplicationBuildId!: string;
  @Field(() => String, { nullable: false })
  newAmplicationBuildId!: string;
  @Field(() => String, { nullable: false })
  installationId!: string;
  // @Field(() => EnumGitProvider, { nullable: false })
  // gitProvider!: EnumGitProvider;
  // @Field(() => GitOrganization, { nullable: false })
  // gitOrganization: GitOrganization;
  // gitRepository: GitRepository;
}
