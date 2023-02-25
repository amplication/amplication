import { INVALID_SOURCE_CONTROL_ERROR_MESSAGE } from "./git.constants";
import { EnumGitProvider, GitProvider, GitProviderArgs } from "../types";
import { GithubService } from "./github.service";
import { BitBucketService } from "./bitbucket/bitbucket.service";

export class GitFactory {
  public static async getProvider(
    gitProviderArgs: GitProviderArgs
  ): Promise<GitProvider> {
    let gitProvider: GitProvider;

    switch (gitProviderArgs.provider) {
      case EnumGitProvider.Github:
        gitProvider = new GithubService(gitProviderArgs);
        await gitProvider.init();
        return gitProvider;
      case EnumGitProvider.Bitbucket:
        gitProvider = new BitBucketService();
        await gitProvider.init();
        return gitProvider;
      default:
        throw new Error(INVALID_SOURCE_CONTROL_ERROR_MESSAGE);
    }
  }
}
