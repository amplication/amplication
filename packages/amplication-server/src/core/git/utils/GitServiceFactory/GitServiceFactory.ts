import { Injectable } from '@nestjs/common';
import { GithubService } from 'src/core/github/github.service';
import { AmplicationError } from 'src/errors/AmplicationError';
import { IGitClient } from '../../contracts/IGitClient';
import { EnumSourceControlService } from '../../dto/enums/EnumSourceControlService';
import { INVALID_SOURCE_CONTROL_ERROR_MESSAGE } from '../../constants';

@Injectable()
export class GitServiceFactory {
  constructor(protected githubService: GithubService) {}
  getService(sourceControlService: EnumSourceControlService): IGitClient {
    switch (sourceControlService) {
      case EnumSourceControlService.Github:
        return this.githubService;
      default:
        throw new AmplicationError(INVALID_SOURCE_CONTROL_ERROR_MESSAGE);
    }
  }
}
