import { Injectable } from "@nestjs/common/decorators";
import { GitFactory } from "./git-provider-factory.interface";
import { INVALID_SOURCE_CONTROL_ERROR_MESSAGE } from "./git.constants";
import { EnumGitProvider } from "./git.types";
import { GithubFactory } from "./github.factory";

@Injectable()
export class GitProviderFactory {
  constructor(protected githubFactory: GithubFactory) {}
  getService(gitProvider: EnumGitProvider): GitFactory {
    switch (gitProvider) {
      case EnumGitProvider.Github:
        return this.githubFactory;
      default:
        throw new Error(INVALID_SOURCE_CONTROL_ERROR_MESSAGE);
    }
  }
}
