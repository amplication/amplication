import { Injectable } from '@nestjs/common';
import { GithubService } from 'src/core/github/github.service';
import { AmplicationError } from 'src/errors/AmplicationError';
import { IGitClient } from '../../contracts/IGitClient';
import { EnumGitProvider } from '../../dto/enums/EnumGitProvider';
import { INVALID_SOURCE_CONTROL_ERROR_MESSAGE } from '../../constants';

@Injectable()
export class GitServiceFactory {
  constructor(protected githubService: GithubService) {}
  getService(gitProvider: EnumGitProvider): IGitClient {
    switch (gitProvider) {
      case EnumGitProvider.Github:
        return this.githubService;
      default:
        throw new AmplicationError(INVALID_SOURCE_CONTROL_ERROR_MESSAGE);
    }
  }
}
