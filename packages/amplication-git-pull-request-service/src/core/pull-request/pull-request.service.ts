import { GitService } from '@amplication/git-utils';
import {
  AmplicationLogger,
  AMPLICATION_LOGGER_PROVIDER,
} from '@amplication/nest-logger-module';
import { Inject, Injectable } from '@nestjs/common';
import { PrModule } from '../../constants';
import { DiffService } from '../diff';
import { SendPullRequestArgs } from './dto/sendPullRequest';

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
  }: SendPullRequestArgs): Promise<string> {
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
    return prUrl;
  }

  private static removeFirstSlashFromPath(
    changedFiles: PrModule[]
  ): PrModule[] {
    return changedFiles.map((module) => {
      return { ...module, path: module.path.replace(new RegExp('^/'), '') };
    });
  }
}
