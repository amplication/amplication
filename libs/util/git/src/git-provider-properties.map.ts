import {
  EnumGitProvider,
  isAwsCodeCommitProviderOrganizationProperties,
  isGitHubProviderOrganizationProperties,
  isOAuthProviderOrganizationProperties,
} from "./types";

export const isValidGitProviderProperties = {
  [EnumGitProvider.Github]: isGitHubProviderOrganizationProperties,
  [EnumGitProvider.Bitbucket]: isOAuthProviderOrganizationProperties,
  [EnumGitProvider.AwsCodeCommit]:
    isAwsCodeCommitProviderOrganizationProperties,
};
