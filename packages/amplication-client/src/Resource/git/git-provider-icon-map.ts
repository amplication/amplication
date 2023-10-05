import { EnumGitProvider } from "../../models";
import BitbucketLogo from "../../assets/images/bitbucket.svg";
import GenericGithubIcon from "../../assets/images/272531990-8b84b9aa-6a62-4168-80a9-9a8982033da7.png";
import AwsCodeCommit from "../../assets/images/awscodecommit.svg";

export const gitProviderIconMap = {
  [EnumGitProvider.Github]: "github",
  [EnumGitProvider.Bitbucket]: "bitbucket",
  [EnumGitProvider.AwsCodeCommit]: "awscodecommit",
};

export const gitLogoMap = {
  [EnumGitProvider.Bitbucket]: BitbucketLogo,
  [EnumGitProvider.Github]: GenericGithubIcon,
  [EnumGitProvider.AwsCodeCommit]: AwsCodeCommit,
};
