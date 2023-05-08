import { EnumGitProvider } from "../models";

const GITHUB_URL = "https://github.com";
const BITBUCKET_URL = "https://bitbucket.org";

/**
 * @param provider - the git provider that the repository belongs to
 * @param gitRepositoryFullName - organizationName/repositoryName For Github and groupName/repositoryName for Bitbucket.
 * Can be null because during the creation of the service in the service wizard,
 * the repository is not yet created
 * @returns the computed git repository url for the given provider and repository full name
 */

export function getGitRepositoryDetails(
  provider: EnumGitProvider,
  organizationName: string | null,
  groupName: string | null,
  repositoryName: string | null
): { repositoryFullName: string; repositoryUrl: string } | null {
  const repositoryFullName =
    provider === EnumGitProvider.Github
      ? `${organizationName}/${repositoryName}`
      : provider === EnumGitProvider.Bitbucket
      ? `${groupName}/${repositoryName}`
      : null;

  const gitRepositoryUrlMap = {
    [EnumGitProvider.Github]: `${GITHUB_URL}/${repositoryFullName}`,
    [EnumGitProvider.Bitbucket]: `${BITBUCKET_URL}/${repositoryFullName}`,
  };

  return {
    repositoryFullName: repositoryFullName,
    repositoryUrl: gitRepositoryUrlMap[provider],
  };
}
