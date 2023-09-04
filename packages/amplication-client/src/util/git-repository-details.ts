import { GitOrganizationFromGitRepository } from "../Resource/git/SyncWithGithubPage";
import { EnumGitProvider, GitOrganization } from "../models";

const GITHUB_URL = "https://github.com";
const BITBUCKET_URL = "https://bitbucket.org";

type GitRepositoryDetails = {
  repositoryFullName: string | null;
  repositoryUrl: string | null;
};

export type GitSyncDetails = {
  organization: GitOrganization | GitOrganizationFromGitRepository;
  repositoryName: string;
  groupName: string;
};

/**
 * After we sync with a git provider, we have git organization, but not git repository (yet)
 * We are getting the repository name and the group name (if applicable) from the caller of this function.
 * Then we construct the repository full name and the url
 * @param organization git organization
 * @param repositoryName git repository name
 * @param groupName git repository group name - only for providers that support grouping for repositories
 * @returns repository full name (constructed based on useGroupingForRepositories ) and url
 */

export function getGitRepositoryDetails({
  organization,
  repositoryName,
  groupName,
}: GitSyncDetails): GitRepositoryDetails {
  if (!organization || !repositoryName) {
    return {
      repositoryFullName: null,
      repositoryUrl: null,
    };
  }
  const {
    name: organizationName,
    useGroupingForRepositories,
    provider,
  } = organization;

  // if the provider supports grouping for repositories, we use the group name, but we need to make sure it exists first,
  // otherwise we use the organization name
  let repositoryFullName = "";

  if (useGroupingForRepositories) {
    repositoryFullName = groupName ? `${groupName}/${repositoryName}` : null;
  } else {
    repositoryFullName = `${organizationName}/${repositoryName}`;
  }

  const gitRepositoryUrlMap = {
    [EnumGitProvider.Github]: `${GITHUB_URL}/${repositoryFullName}`,
    [EnumGitProvider.Bitbucket]: `${BITBUCKET_URL}/${repositoryFullName}`,
    [EnumGitProvider.AwsCodeCommit]: `https://console.aws.amazon.com/codesuite/codecommit/repositories/${repositoryFullName}/browse`,
  };

  return {
    repositoryFullName: repositoryFullName,
    repositoryUrl: gitRepositoryUrlMap[provider],
  };
}
