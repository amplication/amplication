import { EnumGitProvider } from "../../models";
import BitbucketLogo from "../../assets/images/bitbucket.svg";
import GithubLogo from "../../assets/images/github.svg";

export const gitProviderIconMap = {
  [EnumGitProvider.Github]: "github",
  [EnumGitProvider.Bitbucket]: "git-sync", // TODO: replace with bitbucket icon (once we have one)
};

export const gitLogoMap = {
  [EnumGitProvider.Bitbucket]: BitbucketLogo,
  [EnumGitProvider.Github]: GithubLogo,
};
