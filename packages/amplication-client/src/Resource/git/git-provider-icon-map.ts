import { EnumGitProvider } from "../../models";
import BitbucketLogo from "../../assets/images/bitbucket.svg";
import GithubLogo from "../../assets/images/github.svg";
import AwsCodeCommit from "../../assets/images/awscodecommit.svg";

export const gitProviderIconMap = {
  [EnumGitProvider.Github]: "github",
  [EnumGitProvider.Bitbucket]: "bitbucket",
  [EnumGitProvider.AwsCodeCommit]: "awscodecommit",
};

export const gitLogoMap = {
  [EnumGitProvider.Bitbucket]: BitbucketLogo,
  [EnumGitProvider.Github]: GithubLogo,
  [EnumGitProvider.AwsCodeCommit]: AwsCodeCommit,
};
