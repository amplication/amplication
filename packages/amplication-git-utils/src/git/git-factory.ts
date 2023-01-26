import { Injectable } from "@nestjs/common";
import { INVALID_SOURCE_CONTROL_ERROR_MESSAGE } from "./git.constants";
import { EnumGitProvider, GitClient, Options } from "../types";
import { ConfigService } from "@nestjs/config";
import { GithubService } from "./github.service";

@Injectable()
export class GitFactory {
  constructor(private readonly config: ConfigService) {}
  getProvider(options: Options): GitClient {
    switch (options.provider) {
      case EnumGitProvider.Github:
        return new GithubService(this.config);
      default:
        throw new Error(INVALID_SOURCE_CONTROL_ERROR_MESSAGE);
    }
  }
}
