import { IGitHostProviderFactory } from '../../contracts/interfaces/gitHostProviderFactory.interface';
import { IGitProvider } from '../../contracts/interfaces/gitProvider.interface';
import { Injectable } from '@nestjs/common';
import { GitProviderEnum } from '../../contracts/enums/gitProvider.enum';
import { CustomError } from '../../errors/CustomError';
import { GitHostProviderService } from '../../providers/gitProvider/gitHostProvider.service';
import { ErrorMessages } from '../../constants/errorMessages';

@Injectable()
export class GitHostProviderFactory implements IGitHostProviderFactory {
  constructor(private gitHubHostProvider: GitHostProviderService) {}
  getHostProvider(provider: GitProviderEnum): IGitProvider {
    switch (provider) {
      case GitProviderEnum.Github:
        return this.gitHubHostProvider;
      default:
        throw new CustomError(ErrorMessages.GIT_HOST_PROVIDER_ERROR);
    }
  }
}
