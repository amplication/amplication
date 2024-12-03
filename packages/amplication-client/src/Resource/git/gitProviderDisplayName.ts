import { EnumGitProvider } from "../../models";

export const gitProviderName: { [key in EnumGitProvider]: string } = {
  [EnumGitProvider.Github]: "GitHub",
  [EnumGitProvider.Bitbucket]: "BitBucket",
  [EnumGitProvider.AwsCodeCommit]: "CodeCommit",
  [EnumGitProvider.GitLab]: "GitLab",
};
