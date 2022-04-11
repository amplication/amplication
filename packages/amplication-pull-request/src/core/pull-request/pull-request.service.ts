import {
  Module,
  ResultMessage,
  SendPullRequestArgs,
  SendPullRequestResponse,
  StatusEnum,
} from '@amplication/common';
import { GitService } from '@amplication/git-service';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { DiffService } from '../diff';

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
    const { base, body, head, title } = commit;
    try {
      const prUrl = await this.gitService.createPullRequest(
        gitProvider,
        gitOrganizationName,
        gitRepositoryName,
        this.removeFirstSlashFromPath(changedFiles),
        head,
        title,
        body,
        base,
        installationId
      );
      return { value: { url: prUrl }, status: StatusEnum.Success, error: null };
    } catch (error) {
      this.logger.error(`Failed to make a pull request in ${gitProvider}`, {
        errorMassage: error,
      });
      return { value: null, status: StatusEnum.GeneralFail, error };
    }
  }
  private removeFirstSlashFromPath(changedFiles: Module[]): Module[] {
    return changedFiles.map((module) => {
      return { ...module, path: module.path.replace(new RegExp('^/'), '') };
    });
  }
}
