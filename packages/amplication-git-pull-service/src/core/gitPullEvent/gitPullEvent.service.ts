import { Injectable } from "@nestjs/common";
import { GitPullEventRepository } from "../../databases/gitPullEvent.repository";
import { StorageService } from "../../providers/storage/storage.service";
import { GitHostProviderService } from "../../providers/gitProvider/gitHostProvider.service";
import { GitClientService } from "../../providers/gitClient/gitClient.service";
import { IGitPullEvent } from "../../contracts/interfaces/gitPullEvent.interface";
import { EnumGitPullEventStatus } from "../../contracts/enums/gitPullEventStatus";
import * as os from "os";

@Injectable()
export class GitPullEventService implements IGitPullEvent {
  constructor(
    private gitPullEventRepository: GitPullEventRepository,
    private storageService: StorageService,
    private gitHostProviderService: GitHostProviderService,
    private gitClientService: GitClientService
  ) {}

  async fetchRepository(
    provider: string,
    repositoryOwner: string,
    repositoryName: string,
    branch: string,
    commit: string,
    status: keyof typeof EnumGitPullEventStatus,
    pushedAt: Date,
    baseDir: string,
    remote: string,
    installationId: string,
    accessToken: string,
    skip: number
  ) {
    const previousReadyCommit =
      await this.gitPullEventRepository.getPreviousReadyCommit(
        {
          provider,
          repositoryOwner,
          repositoryName,
          branch,
          commit,
          pushedAt,
        },
        skip
      );

    if (!previousReadyCommit) {
      await this.gitClientService.clone(
        provider,
        repositoryOwner,
        repositoryName,
        branch,
        commit,
        pushedAt,
        baseDir,
        installationId,
        accessToken
      );
      await this.gitPullEventRepository.create(
        provider,
        repositoryOwner,
        repositoryName,
        branch,
        commit,
        EnumGitPullEventStatus.Created,
        pushedAt
      );
    }

    if (previousReadyCommit && skip === 0) {
      await this.gitClientService.pull(remote, branch, commit, baseDir);
      await this.gitPullEventRepository.update(
        previousReadyCommit.id,
        EnumGitPullEventStatus.Ready
      );
    }

    if (previousReadyCommit && skip !== 0) {
      await this.storageService.copyDir(
        `${os.homedir()}/git-remote/${repositoryOwner}/${repositoryName}/${branch}/${
          previousReadyCommit.commit
        }`,
        `${os.homedir()}/git-remote/${repositoryOwner}/${repositoryName}/${branch}/${commit}`
      );
      await this.gitClientService.pull(remote, branch, commit, baseDir);
      await this.gitPullEventRepository.update(
        previousReadyCommit.id,
        EnumGitPullEventStatus.Deleted
      );
    }
  }
}
