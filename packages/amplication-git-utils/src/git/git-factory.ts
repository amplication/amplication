import { IGitProvider } from "../IGitProvider";
import { EnumGitProvider, GitProviderArgs } from "../types";
import { INVALID_SOURCE_CONTROL_ERROR_MESSAGE } from "./git.constants";
import { GithubService } from "./github.service";

export class GitFactory {
  public static async getProvider(
    gitProviderArgs: GitProviderArgs
  ): Promise<IGitProvider> {
    let gitProvider: IGitProvider;

    switch (gitProviderArgs.provider) {
      case EnumGitProvider.Github:
        gitProvider = new GithubService(gitProviderArgs);
        await gitProvider.init();
        return gitProvider;
      default:
        throw new Error(INVALID_SOURCE_CONTROL_ERROR_MESSAGE);
    }
  }
}
