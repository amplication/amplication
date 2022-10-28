import { GitService } from '@amplication/git-utils';
import {
  AmplicationLogger,
  AMPLICATION_LOGGER_PROVIDER,
} from '@amplication/nest-logger-module';
import { Inject, Injectable } from '@nestjs/common';
import { PrModule } from '../types';
import { DiffService } from '../diff/diff.service';

import { ResultMessage } from './dto/result-message.dto';
import { CreatePullRequestArgs } from './dto/create-pull-request.args';
import { PullRequestResponse } from './dto/pull-request-response.dto';
import { StatusEnum } from './pull-request.type';

@Injectable()
export class PullRequestService {
  constructor(
    private readonly diffService: DiffService,
    protected readonly gitService: GitService,
    @Inject(AMPLICATION_LOGGER_PROVIDER)
    private readonly logger: AmplicationLogger
  ) {}
  async createPullRequest({
    resourceId,
    oldBuildId,
    newBuildId,
    gitOrganizationName,
    gitRepositoryName,
    installationId,
    commit,
    gitProvider,
    gitResourceMeta,
  }: CreatePullRequestArgs): Promise<ResultMessage<PullRequestResponse>> {
    const { base, body, head, title } = commit;
    const changedFiles = await this.diffService.listOfChangedFiles(
      resourceId,
      oldBuildId,
      newBuildId
    );
    this.logger.info(
      'The changed files has return from the diff service listOfChangedFiles',
      { lengthOfFile: changedFiles.length }
    );

    const prUrl = await this.gitService.createPullRequest(
      gitProvider,
      gitOrganizationName,
      gitRepositoryName,
      PullRequestService.removeFirstSlashFromPath(changedFiles),
      head,
      title,
      body,
      installationId,
      gitResourceMeta,
      base
    );
    this.logger.info('Opened a new pull request', { prUrl });
    return { value: { url: prUrl }, status: StatusEnum.Success, error: null };
  }
  private static removeFirstSlashFromPath(
    changedFiles: PrModule[]
  ): PrModule[] {
    return changedFiles.map((module) => {
      return { ...module, path: module.path.replace(new RegExp('^/'), '') };
    });
  }
}
