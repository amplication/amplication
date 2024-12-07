import { EnumGitProvider } from "../../models";

export const GIT_PROVIDER_ICON_MAP: { [key in EnumGitProvider]: string } = {
  [EnumGitProvider.Github]: "github",
  [EnumGitProvider.Bitbucket]: "bitbucket",
  [EnumGitProvider.AwsCodeCommit]: "awscodecommit",
  [EnumGitProvider.GitLab]: "gitlab",
  [EnumGitProvider.AzureDevOps]: "azuredevops",
};

export const GIT_PROVIDER_NAME: { [key in EnumGitProvider]: string } = {
  [EnumGitProvider.Github]: "GitHub",
  [EnumGitProvider.Bitbucket]: "BitBucket",
  [EnumGitProvider.AwsCodeCommit]: "CodeCommit",
  [EnumGitProvider.GitLab]: "GitLab",
  [EnumGitProvider.AzureDevOps]: "Azure DevOps",
};
