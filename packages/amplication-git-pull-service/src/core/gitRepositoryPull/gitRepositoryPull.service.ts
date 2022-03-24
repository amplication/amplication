import { Injectable } from "@nestjs/common";
import { GitClientService } from "../../providers/gitClient/gitClient.service";
import { GitProviderService } from "../../providers/git/gitProvider.service";
import { ICloneParams, IPullParams } from "../../contracts/gitClient.interface";
import { PrismaService } from "nestjs-prisma";
import { GitPullEventRepository } from "../../database/gitPullEvent.repository";

@Injectable()
export class GitRepositoryPullService {
  constructor(private gitClient: GitClientService,
              private gitHubProvider: GitProviderService,
              private database: GitPullEventRepository) {}

  async clone(cloneParams: ICloneParams) {
    const { provider, owner, branch, commit, installationId } = cloneParams;
    const baseDir = `/Users/amitbarletz/Dev/remote/${provider}/${owner}/${name}/${branch}/${commit}`;
    const accessToken = await this.gitHubProvider.createInstallationAccessToken(installationId);
    return this.gitClient.clone(cloneParams, baseDir, accessToken);
  }

  pull(pullParams: IPullParams) {
    return this.gitClient.pull(pullParams)
  }
}
