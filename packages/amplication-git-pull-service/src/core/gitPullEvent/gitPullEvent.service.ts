import { Injectable } from "@nestjs/common";
import { GitClientService } from "../../providers/gitClient/gitClient.service";
import { GitProviderService } from "../../providers/git/gitProvider.service";
import { ICloneParams, IPullParams } from "../../contracts/gitClient.interface";
import { GitPullEventRepository } from "../../databases/gitPullEvent.repository";
import { EnumGitPullEventStatus } from "../../contracts/databaseOperations.interface";

@Injectable()
export class GitPullEventService {
  constructor(
    private gitClient: GitClientService,
    private gitHubProvider: GitProviderService,
    private database: GitPullEventRepository
  ) {}

  async clone(
    cloneParams: ICloneParams,
    installationId: string,
    pushedAt: string
  ) {
    const { provider, repositoryOwner, repositoryName, branch, commit } =
      cloneParams;
    const baseDir = `/Users/amitbarletz/Dev/remote/${provider}/${repositoryOwner}/${repositoryName}/${branch}/${commit}`;
    const accessToken = await this.gitHubProvider.createInstallationAccessToken(
      installationId
    );
    // clone to storage
    this.gitClient.clone(cloneParams, baseDir, installationId, accessToken);
    // save to DB
    await this.database.create({
      provider,
      repositoryOwner,
      repositoryName,
      branch,
      commit,
      status: EnumGitPullEventStatus.Created,
      pushedAt,
    });
  }

  async pull(pullParams: IPullParams, id: number) {
    // pull tho storage
    this.gitClient.pull(pullParams);
    // update DB
    await this.database.update(id, EnumGitPullEventStatus.Ready);
  }
}
