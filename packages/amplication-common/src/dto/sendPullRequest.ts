import { EnumGitProvider } from "../types";

export class SendPullRequestArgs {
  amplicationAppId!: string;
  oldBuildId!: string;
  newBuildId!: string;
  installationId!: string;
  gitProvider!: EnumGitProvider;
  // @Field(() => GitOrganization, { nullable: false })
  // gitOrganization: GitOrganization;
  // gitRepository: GitRepository;
}
