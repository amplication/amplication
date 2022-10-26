import {
  GitHostProviderFactory as GitHostProviderFactoryInterface,
  GitProvider,
  GitProviderEnum
} from "./types";
import { Injectable } from "@nestjs/common";
import { GitHostProviderService } from "./git-host-provider.service";
import { ErrorMessages } from "./constants";

@Injectable()
export class GitHostProviderFactory implements GitHostProviderFactoryInterface {
  constructor(private gitHubHostProvider: GitHostProviderService) {}
  getHostProvider(provider: GitProviderEnum): GitProvider {
    switch (provider) {
      case GitProviderEnum.Github:
        return this.gitHubHostProvider;
      default:
        throw new Error(ErrorMessages.GIT_HOST_PROVIDER_ERROR);
    }
  }
}
