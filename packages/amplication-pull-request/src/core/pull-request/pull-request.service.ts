import {
  Module,
  SendPullRequestArgs,
  SendPullRequestResponse,
} from '@amplication/common';
import { GitService } from '@amplication/git-service';
import { Injectable } from '@nestjs/common';
import { DiffService } from '../diff';

@Injectable()
export class PullRequestService {
  constructor(
    private readonly diffService: DiffService,
    protected readonly gitService: GitService
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
  }: SendPullRequestArgs): Promise<SendPullRequestResponse> {
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
      return { url: prUrl };
    } catch (error) {
      return null;
    }
  }
  private removeFirstSlashFromPath(changedFiles: Module[]): Module[] {
    return changedFiles.map((module) => {
      return { ...module, path: module.path.replace(new RegExp('^/'), '') };
    });
  }
}
