import { Injectable } from '@nestjs/common';
import { DiffService } from '../diff';
import { SendPullRequestArgs } from './dto';
import { PullRequest } from './pullRequest';

@Injectable()
export class PullRequestService {
  constructor(private readonly diffService: DiffService) {}
  async createPullRequest({
    amplicationAppId,
    oldBuildId,
    newBuildId,
    gitProvider,
  }: SendPullRequestArgs): Promise<PullRequest> {
    const changedFiles = await this.diffService.listOfChangedFiles(
      amplicationAppId,
      oldBuildId,
      newBuildId
    );
    const pullRequest = new PullRequest(gitProvider);
    return pullRequest;
  }
}
