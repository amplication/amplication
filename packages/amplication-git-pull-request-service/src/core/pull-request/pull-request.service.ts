import { GitService } from '@amplication/git-service';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { DiffService } from '../diff';
import { ResultMessage } from './dto/ResultMessage';
import { SendPullRequestArgs } from './dto/sendPullRequest';
import { SendPullRequestResponse } from './dto/sendPullRequestResponse';
import { StatusEnum } from './dto/StatusEnum';

@Injectable()
export class PullRequestService {
  constructor(
    private readonly diffService: DiffService,
    protected readonly gitService: GitService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}
  async createPullRequest({
    amplicationAppId,
    oldBuildId,
    newBuildId,
    gitOrganizationName,
    gitRepositoryName,
    installationId,
    commit,
    gitProvider,
  }: SendPullRequestArgs): Promise<ResultMessage<SendPullRequestResponse>> {
    const changedFiles = await this.diffService.listOfChangedFiles(
      amplicationAppId,
      oldBuildId,
      newBuildId
    );
    this.logger.info(
      'The changed files has return from the diff service listOfChangedFiles',
      { lengthOfFile: changedFiles.length }
    );

    const { base, body, head, title } = commit;
    const prUrl = await this.gitService.createPullRequest(
      gitProvider,
      gitOrganizationName,
      gitRepositoryName,
      PullRequestService.removeFirstSlashFromPath(changedFiles),
      head,
      title,
      body,
      base,
      installationId
    );
    this.logger.info('Opened a new pull request', { prUrl });
    return { value: { url: prUrl }, status: StatusEnum.Success, error: null };
  }
  private static removeFirstSlashFromPath(
    changedFiles: { code: string; path: string }[]
  ): { code: string; path: string }[] {
    return changedFiles.map((module) => {
      return { ...module, path: module.path.replace(new RegExp('^/'), '') };
    });
  }
}
