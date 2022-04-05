import { SendPullRequestArgs } from '@amplication/common';
import { Injectable } from '@nestjs/common';
import { DiffService } from '../diff';
import { PullRequest } from './pullRequest';

@Injectable()
export class PullRequestService {
  constructor(private readonly diffService: DiffService) {}
  async createPullRequest({
    amplicationAppId,
    oldBuildId,
    newBuildId,
    gitOrganizationName,
    gitRepositoryName,
    installationId,
    commit,
    gitProvider,
  }: SendPullRequestArgs): Promise<PullRequest> {
    const changedFiles = await this.diffService.listOfChangedFiles(
      amplicationAppId,
      oldBuildId,
      newBuildId
    );
    const pullRequest = new PullRequest(
      gitProvider,
      gitOrganizationName,
      gitRepositoryName,
      commit,
      changedFiles
    );
    return pullRequest;
  }
}
