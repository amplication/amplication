import { Injectable } from '@nestjs/common';
import { DiffService } from '../diff';
import { IPullRequestService } from './contracts';
import { PullRequest } from './pullRequest';

@Injectable()
export class PullRequestService implements IPullRequestService {
  constructor(private readonly diffService: DiffService) {}
  createPullRequest(): PullRequest {
    const changedFiles = this.diffService.listOfChangedFiles();
    throw new Error('fds');
  }
}
