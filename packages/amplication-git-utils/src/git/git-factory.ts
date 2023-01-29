import { INVALID_SOURCE_CONTROL_ERROR_MESSAGE } from "./git.constants";
import { EnumGitProvider, GitProvider, GitProviderArgs } from "../types";
import { GithubService } from "./github.service";

export class GitFactory {
  public static getProvider(options: GitProviderArgs): GitProvider {
    switch (options.provider) {
      case EnumGitProvider.Github:
        return new GithubService(options);
      default:
        throw new Error(INVALID_SOURCE_CONTROL_ERROR_MESSAGE);
    }
  }
}
