import { Injectable } from '@nestjs/common';
import { IGitClient } from '../contracts/IGitClient';
import { EnumGitProvider } from '../Dto/enums/EnumGitProvider';
import { GithubService } from '../providers/github.service';
import { INVALID_SOURCE_CONTROL_ERROR_MESSAGE } from './constants';

@Injectable()
export class GitServiceFactory {
  constructor(protected githubService: GithubService) {}
  getService(gitProvider: EnumGitProvider): IGitClient {
    switch (gitProvider) {
      case EnumGitProvider.Github:
        return this.githubService;
      default:
        throw new Error(INVALID_SOURCE_CONTROL_ERROR_MESSAGE);
    }
  }
}
