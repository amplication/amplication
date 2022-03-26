import { Injectable } from "@nestjs/common";
import { GitClientService } from "../../providers/gitClient/gitClient.service";
import { GitProviderService } from "../../providers/git/gitProvider.service";
import { ICloneParams, IPullParams } from "../../contracts/gitClient.interface";
import { GitPullEventRepository } from "../../databases/gitPullEvent.repository";

@Injectable()
export class GitPullEventService {
  constructor(
    private gitClient: GitClientService,
    private gitHubProvider: GitProviderService,
    private database: GitPullEventRepository
  ) {}

  async clone(cloneParams: ICloneParams, installationId: string) {
    const { provider, repositoryOwner, repositoryName, branch, commit } =
      cloneParams;
    const baseDir = `/Users/amitbarletz/Dev/remote/${provider}/${repositoryOwner}/${repositoryName}/${branch}/${commit}`;
    const accessToken = await this.gitHubProvider.createInstallationAccessToken(
      installationId
    );
    return this.gitClient.clone(
      cloneParams,
      baseDir,
      installationId,
      accessToken
    );
  }

  pull(pullParams: IPullParams) {
    return this.gitClient.pull(pullParams);
  }
}
