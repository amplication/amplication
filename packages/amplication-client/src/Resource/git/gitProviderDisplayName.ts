import { EnumGitProvider } from "../../models";

export const gitProviderName = {
  [EnumGitProvider.Github]: "GitHub",
  [EnumGitProvider.Bitbucket]: "BitBucket",
  [EnumGitProvider.AwsCodeCommit]: "CodeCommit",
};
