import { ILogger } from "@amplication/util/logging";
import { GitProvider } from "../git-provider.interface";
import {
  EnumGitProvider,
  GitProviderArgs,
  GitProvidersConfiguration,
  isGitHubProviderOrganizationProperties,
  isOAuthProviderOrganizationProperties,
} from "../types";
import { INVALID_SOURCE_CONTROL_ERROR_MESSAGE } from "./git.constants";
import { GithubService } from "./github/github.service";
import { BitBucketService } from "./bitbucket/bitbucket.service";

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
          isGitHubProviderOrganizationProperties(providerOrganizationProperties)
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
          isOAuthProviderOrganizationProperties(providerOrganizationProperties)
        ) {
          gitProvider = new BitBucketService(
            providerOrganizationProperties,
            providersConfiguration.bitBucketConfiguration,
            logger
          );
          await gitProvider.init();
          return gitProvider;
        }
    }
    throw new Error(INVALID_SOURCE_CONTROL_ERROR_MESSAGE);
  }
}
