import { ILogger } from "@amplication/util/logging";
import { GitProvider } from "./git-provider.interface";
import { EnumGitProvider } from "./types";
import { INVALID_SOURCE_CONTROL_ERROR_MESSAGE } from "./git.constants";
import { GithubService } from "./providers/github/github.service";
import { BitBucketService } from "./providers/bitbucket/bitbucket.service";
import { GitProviderArgs, GitProvidersConfiguration } from "./types";
import { AwsCodeCommitService } from "./providers/aws/aws-code-commit.service";
import { isValidGitProviderProperties } from "./git-provider-properties.map";
import { GitLabService } from "./providers/gitlab/gitlab.service";
import { AzureDevOpsService } from "./providers/azure-devops/azure-devops.service";

export class GitFactory {
  public static async getProvider(
    { provider, providerOrganizationProperties }: GitProviderArgs,
    providersConfiguration: GitProvidersConfiguration,
    logger: ILogger
  ): Promise<GitProvider> {
    let gitProvider: GitProvider;

    switch (provider) {
      case EnumGitProvider.Github:
        if (
          isValidGitProviderProperties[provider](providerOrganizationProperties)
        ) {
          gitProvider = new GithubService(
            providerOrganizationProperties,
            providersConfiguration.gitHubConfiguration,
            logger
          );
          await gitProvider.init();
          return gitProvider;
        }
        break;
      case EnumGitProvider.Bitbucket:
        if (
          isValidGitProviderProperties[provider](providerOrganizationProperties)
        ) {
          gitProvider = new BitBucketService(
            providerOrganizationProperties,
            providersConfiguration.bitBucketConfiguration,
            logger
          );
          await gitProvider.init();
          return gitProvider;
        }
        break;
      case EnumGitProvider.GitLab:
        if (
          isValidGitProviderProperties[provider](providerOrganizationProperties)
        ) {
          gitProvider = new GitLabService(
            providerOrganizationProperties,
            providersConfiguration.gitLabConfiguration,
            logger
          );
          await gitProvider.init();
          return gitProvider;
        }
        break;
      case EnumGitProvider.AzureDevOps:
        if (
          isValidGitProviderProperties[provider](providerOrganizationProperties)
        ) {
          gitProvider = new AzureDevOpsService(
            providerOrganizationProperties,
            providersConfiguration.azureDevopsConfiguration,
            logger
          );
          await gitProvider.init();
          return gitProvider;
        }
        break;
      case EnumGitProvider.AwsCodeCommit:
        if (
          isValidGitProviderProperties[provider](providerOrganizationProperties)
        ) {
          gitProvider = new AwsCodeCommitService(
            providerOrganizationProperties,
            logger
          );
          await gitProvider.init();
          return gitProvider;
        }
        break;
      default:
        throw new Error(INVALID_SOURCE_CONTROL_ERROR_MESSAGE);
    }
    throw new Error(INVALID_SOURCE_CONTROL_ERROR_MESSAGE);
  }
}
