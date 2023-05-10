import { GitOrganizationFromGitRepository } from "../Resource/git/SyncWithGithubPage";
import { EnumGitProvider, GitOrganization, GitRepository } from "../models";

const GITHUB_URL = "https://github.com";
const BITBUCKET_URL = "https://bitbucket.org";

/**
 * @param organization git organization
 * @param repository git repository
 * @returns repository full name (constructed based on useGroupingForRepositories ) and url
 */

export function getGitRepositoryDetails(
  organization: GitOrganization | GitOrganizationFromGitRepository,
  repository: GitRepository
): {
  repositoryFullName: string | null;
  repositoryUrl: string | null;
} {
  if (!organization || !repository) {
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

  const { name: repositoryName, groupName } = repository;

  const repositoryFullName = useGroupingForRepositories
    ? `${organizationName}/${repositoryName}`
    : `${groupName}/${repositoryName}`;

  const gitRepositoryUrlMap = {
    [EnumGitProvider.Github]: `${GITHUB_URL}/${repositoryFullName}`,
    [EnumGitProvider.Bitbucket]: `${BITBUCKET_URL}/${repositoryFullName}`,
  };

  return {
    repositoryFullName: repositoryFullName,
    repositoryUrl: gitRepositoryUrlMap[provider],
  };
}
