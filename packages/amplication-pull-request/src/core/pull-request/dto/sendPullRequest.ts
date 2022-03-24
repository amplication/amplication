import {
  EnumGitProvider,
  GitOrganization,
  GitRepository,
} from "../../../models";

export class SendPullRequestArgs {
  previousAmplicationBuildId: string;
  newAmplicationBuildId: string;
  installationId: string;
  gitProvider: EnumGitProvider;
  gitOrganization: GitOrganization;
  gitRepository: GitRepository;
}
