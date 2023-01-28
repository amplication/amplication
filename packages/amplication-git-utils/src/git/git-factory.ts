import { Injectable } from "@nestjs/common";
import { INVALID_SOURCE_CONTROL_ERROR_MESSAGE } from "./git.constants";
import { EnumGitProvider, GitProviderArgs } from "../types";
import { GithubService } from "./github.service";

@Injectable()
export class GitFactory {
  getProvider(options: GitProviderArgs) {
    switch (options.provider) {
      case EnumGitProvider.Github:
        return new GithubService(options);
      default:
        throw new Error(INVALID_SOURCE_CONTROL_ERROR_MESSAGE);
    }
  }
}
