import { GitOrganizationFromGitRepository } from "../Resource/git/ResourceGitSettingsPage";
import { EnumGitProvider, GitOrganization } from "../models";

const GITHUB_URL = "https://github.com";
const BITBUCKET_URL = "https://bitbucket.org";
const GITLAB_URL = "https://gitlab.com";
const AZURE_DEVOPS_URL = "https://dev.azure.com";

type GitRepositoryDetails = {
  repositoryFullName: string | null;
  repositoryUrl: string | null;
  webIdeUrl: string | null;
  webIdeName: string | null;
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
      webIdeUrl: null,
      webIdeName: null,
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

  const gitRepositoryUrlMap: { [key in EnumGitProvider]: string } = {
    [EnumGitProvider.Github]: `${GITHUB_URL}/${repositoryFullName}`,
    [EnumGitProvider.Bitbucket]: `${BITBUCKET_URL}/${repositoryFullName}`,
    [EnumGitProvider.AwsCodeCommit]: `https://console.aws.amazon.com/codesuite/codecommit/repositories/${repositoryFullName}/browse`,
    [EnumGitProvider.GitLab]: `${GITLAB_URL}/${repositoryFullName}`,
    [EnumGitProvider.AzureDevOps]: `${AZURE_DEVOPS_URL}/${organizationName}/${groupName}/_git/${repositoryName}`,
  };

  const webIdeUrlMap: {
    [key in EnumGitProvider]: {
      webIdeUrl: string;
      webIdeName: string;
    };
  } = {
    [EnumGitProvider.Github]: {
      webIdeUrl: `https://codespaces.new/${repositoryFullName}?quickstart=1`,
      webIdeName: "Codespaces",
    },
    [EnumGitProvider.Bitbucket]: {
      webIdeUrl: null,
      webIdeName: null,
    },
    [EnumGitProvider.AwsCodeCommit]: {
      webIdeUrl: null,
      webIdeName: null,
    },
    [EnumGitProvider.GitLab]: {
      webIdeUrl: `${GITLAB_URL}/-/ide/project/${repositoryFullName}`,
      webIdeName: "Web IDE",
    },
    [EnumGitProvider.AzureDevOps]: {
      webIdeUrl: null,
      webIdeName: null,
    },
  };

  return {
    repositoryFullName: repositoryFullName,
    repositoryUrl: gitRepositoryUrlMap[provider],
    ...webIdeUrlMap[provider],
  };
}
