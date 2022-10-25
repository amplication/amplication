import {
  GitHostProviderFactory as GitHostProviderFactoryInterface,
  GitProvider,
} from "../../interfaces";
import { Injectable } from "@nestjs/common";
import { GitProviderEnum } from "../../enums";
import { CustomError } from "../../errors/custom-error";
import { GitHostProviderService } from "./git-host-provider.service";
import { ErrorMessages } from "../../constants/error-messages";

@Injectable()
export class GitHostProviderFactory implements GitHostProviderFactoryInterface {
  constructor(private gitHubHostProvider: GitHostProviderService) {}
  getHostProvider(provider: GitProviderEnum): GitProvider {
    switch (provider) {
      case GitProviderEnum.Github:
        return this.gitHubHostProvider;
      default:
        throw new CustomError(ErrorMessages.GIT_HOST_PROVIDER_ERROR);
    }
  }
}
