import { Injectable } from "@nestjs/common";
import { GithubService } from "./github.service";
import { INVALID_SOURCE_CONTROL_ERROR_MESSAGE } from "./git.constants";
import { EnumGitProvider, GitClient } from "../types";

@Injectable()
export class GitServiceFactory {
  constructor(protected githubService: GithubService) {}
  getService(gitProvider: EnumGitProvider): GitClient {
    switch (gitProvider) {
      case EnumGitProvider.Github:
        return this.githubService;
      default:
        throw new Error(INVALID_SOURCE_CONTROL_ERROR_MESSAGE);
    }
  }
}
