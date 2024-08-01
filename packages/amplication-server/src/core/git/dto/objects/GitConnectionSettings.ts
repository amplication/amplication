import { EnumGitProvider, GitProviderProperties } from "@amplication/util/git";

export class GitConnectionSettings {
  gitOrganizationName: string;
  gitRepositoryName: string;
  baseBranchName: string;
  repositoryGroupName: string;
  gitProvider: EnumGitProvider;
  gitProviderProperties: GitProviderProperties;
}
