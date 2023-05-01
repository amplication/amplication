import { EnumGitProvider } from "../models";

const GITHUB_URL = "https://github.com";
const BITBUCKET_URL = "https://bitbucket.org";

/**
 * @param provider - the git provider that the repository belongs to
 * @param gitRepositoryFullName - organizationName/repositoryName. Can be null because during the creation of the service in the service wizard,
 * the repository is not yet created
 * @returns the computed git repository url for the given provider and repository full name
 */

export function getGitRepositoryUrlForServiceWizard(
  provider: EnumGitProvider,
  gitRepositoryFullName: string | null
): string | null {
  const gitRepositoryUrlMap = {
    [EnumGitProvider.Github]: `${GITHUB_URL}/${gitRepositoryFullName}`,
    [EnumGitProvider.Bitbucket]: `${BITBUCKET_URL}/${gitRepositoryFullName}`,
  };

  return gitRepositoryUrlMap[provider];
}
