import { EnumGitProvider } from "@amplication/code-gen-types";
import React from "react";
import AwsCodeCommit from "../../assets/images/awscodecommit.svg";
import AzureDevops from "../../assets/images/azuredevops.svg";
import BitbucketLogo from "../../assets/images/bitbucket.svg";
import GithubLogo from "../../assets/images/github.svg";
import GitLab from "../../assets/images/gitlab.svg";
import "./GitProviderLogo.scss";

type Props = {
  gitProvider?: EnumGitProvider;
};

const GIT_LOGO_MAP: { [key in EnumGitProvider]: string } = {
  [EnumGitProvider.Bitbucket]: BitbucketLogo,
  [EnumGitProvider.Github]: GithubLogo,
  [EnumGitProvider.AwsCodeCommit]: AwsCodeCommit,
  [EnumGitProvider.GitLab]: GitLab,
  [EnumGitProvider.AzureDevOps]: AzureDevops,
};

const GitProviderLogo: React.FC<Props> = ({ gitProvider }) => {
  return (
    <img className="git-provider-logo" src={GIT_LOGO_MAP[gitProvider]} alt="" />
  );
};

export default GitProviderLogo;
