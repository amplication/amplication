import { EnumGitProvider } from "../../models";
import BitbucketLogo from "../../assets/images/bitbucket.svg";
import GithubLogo from "../../assets/images/github.svg";
import AwsCodeCommit from "../../assets/images/awscodecommit.svg";
import GitLab from "../../assets/images/gitlab.svg";
import AzureDevops from "../../assets/images/azuredevops.svg";

export const GIT_PROVIDER_ICON_MAP: { [key in EnumGitProvider]: string } = {
  [EnumGitProvider.Github]: "github",
  [EnumGitProvider.Bitbucket]: "bitbucket",
  [EnumGitProvider.AwsCodeCommit]: "awscodecommit",
  [EnumGitProvider.GitLab]: "gitlab",
  [EnumGitProvider.AzureDevOps]: "azuredevops",
};

export const GIT_LOGO_MAP: { [key in EnumGitProvider]: string } = {
  [EnumGitProvider.Bitbucket]: BitbucketLogo,
  [EnumGitProvider.Github]: GithubLogo,
  [EnumGitProvider.AwsCodeCommit]: AwsCodeCommit,
  [EnumGitProvider.GitLab]: GitLab,
  [EnumGitProvider.AzureDevOps]: AzureDevops,
};

export const GIT_PROVIDER_NAME: { [key in EnumGitProvider]: string } = {
  [EnumGitProvider.Github]: "GitHub",
  [EnumGitProvider.Bitbucket]: "BitBucket",
  [EnumGitProvider.AwsCodeCommit]: "CodeCommit",
  [EnumGitProvider.GitLab]: "GitLab",
  [EnumGitProvider.AzureDevOps]: "Azure DevOps",
};
