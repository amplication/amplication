import { GitProvider, GitProviderEnum } from "./git-pull-event.types";
import { Injectable } from "@nestjs/common";
import { GitHostProviderService } from "./git-host-provider.service";
import { ErrorMessages } from "./git-pull-event.types";

@Injectable()
export class GitHostProviderFactory {
  constructor(private gitHubHostProvider: GitHostProviderService) {}
  getHostProvider(provider: GitProviderEnum): GitProvider {
    switch (provider) {
      case GitProviderEnum.Github:
        return this.gitHubHostProvider;
      default:
        throw new Error(ErrorMessages.GitHostProviderError);
    }
  }
}
