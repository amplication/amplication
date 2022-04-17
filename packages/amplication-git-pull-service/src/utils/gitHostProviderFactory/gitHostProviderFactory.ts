import { Injectable } from "@nestjs/common";
import { GitProviderEnum } from "../../contracts/enums/gitProvider.enum";
import { CustomError } from "../../errors/CustomError";
import { GitHostProviderService } from "../../providers/gitProvider/gitHostProvider.service";
import { ErrorMessages } from "../../constants/errorMessages";

@Injectable()
export class GitHostProviderFactory {
  constructor(private gitHubHostProvider: GitHostProviderService) {}
  getHostProvider(provider: GitProviderEnum) {
    switch (provider) {
      case GitProviderEnum.Github:
        return this.gitHubHostProvider;
      default:
        throw new CustomError(ErrorMessages.GIT_HOST_PROVIDER_ERROR);
    }
  }
}
