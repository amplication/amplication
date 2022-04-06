import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { GitPullEventRepository } from "../../databases/gitPullEvent.repository";
import { StorageService } from "../../providers/storage/storage.service";
import { GitClientService } from "../../providers/gitClient/gitClient.service";
import { IGitPullEvent } from "../../contracts/interfaces/gitPullEvent.interface";
import { EnumGitPullEventStatus } from "../../contracts/enums/gitPullEventStatus.enum";
import { GitHostProviderFactory } from "../../utils/gitHostProviderFactory/gitHostProviderFactory";
import { resolve } from "path";
import { EventData } from "../../contracts/interfaces/eventData";
import { GitFetchTypeEnum } from "../../contracts/enums/gitFetchType.enum";
import { GitProviderEnum } from "../../contracts/enums/gitProvider.enum";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { LoggerMessages } from "../../constants/loggerMessages";

@Injectable()
export class GitPullEventService implements IGitPullEvent {
  constructor(
    private gitPullEventRepository: GitPullEventRepository,
    private storageService: StorageService,
    private readonly gitHostProviderFactory: GitHostProviderFactory,
    private gitClientService: GitClientService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  async pushEventHandler(
    eventData: EventData,
    installationId: string
  ): Promise<void> {
    const {
      provider,
      repositoryOwner,
      repositoryName,
      branch,
      commit,
      pushedAt,
    } = eventData;

    const baseDir = resolve(
      `/git-remote/${provider}/${repositoryOwner}/${repositoryName}/${branch}/${commit}`
    );

    try {
      const accessToken = await this.gitHostProviderFactory
        .getHostProvider(provider as GitProviderEnum)
        .createInstallationAccessToken(installationId);

      this.logger.log(
        LoggerMessages.log.GENERATE_OCTOKIT_ACCESS_TOKEN,
        GitPullEventService.name,
        "pushEventHandler"
      );

      await this.createNewGitPullEventRecord(eventData);

      const previousReadyCommit =
        await this.gitPullEventRepository.findByPreviousReadyCommit(
          {
            provider,
            repositoryOwner,
            repositoryName,
            branch,
            commit,
            pushedAt,
          },
          GitPullEventService.getSkipValue()
        );

      if (!previousReadyCommit) {
        this.logger.log("previous ready commit not found, start cloning...");
        return this.resolveFetchType(
          GitFetchTypeEnum.Clone,
          eventData,
          baseDir,
          installationId,
          accessToken,
          GitPullEventService.getSkipValue()
        );
      }

      this.logger.log("previous ready commit was found, start pulling...");
      return this.resolveFetchType(
        GitFetchTypeEnum.Pull,
        eventData,
        baseDir,
        installationId,
        accessToken,
        GitPullEventService.getSkipValue(),
        previousReadyCommit
      );
    } catch (err) {
      // TODO: catch the error from the service ?
      this.logger.error(
        LoggerMessages.error.CATCH_ERROR_MESSAGE,
        GitPullEventService.name,
        { err }
      );
    }
  }

  private async createNewGitPullEventRecord(eventData: EventData) {
    await this.gitPullEventRepository.create(eventData);
  }

  private resolveFetchType(
    gitFetchType: GitFetchTypeEnum,
    eventData: EventData,
    baseDir: string,
    installationId: string,
    accessToken: string,
    skip: number,
    previousReadyCommit?: EventData
  ) {
    switch (gitFetchType) {
      case GitFetchTypeEnum.Clone:
        return this.cloneRepository(
          eventData,
          baseDir,
          installationId,
          accessToken
        );
      case GitFetchTypeEnum.Pull:
        return this.pullRepository(
          previousReadyCommit!,
          eventData,
          baseDir,
          skip
        );
    }
  }

  private async cloneRepository(
    eventData: EventData,
    baseDir: string,
    installationId: string,
    accessToken: string
  ) {
    await this.gitClientService.clone(
      eventData,
      baseDir,
      installationId,
      accessToken
    );
    await this.gitPullEventRepository.create(eventData);
  }

  private async pullRepository(
    previousReadyCommit: EventData,
    eventData: EventData,
    baseDir: string,
    skip: number
  ) {
    const { provider, repositoryOwner, repositoryName, branch, commit } =
      eventData;
    await this.storageService.copyDir(
      resolve(
        `/git-remote/${provider}/${repositoryOwner}/${repositoryName}/${branch}/${previousReadyCommit.commit}`
      ),
      baseDir
    );
    await this.gitClientService.pull(branch, commit, baseDir);
    await this.gitPullEventRepository.update(
      eventData.id!,
      GitPullEventService.updateEventPullStatus(skip)
    );
  }

  private static getSkipValue(): number {
    return 0;
  }

  private static updateEventPullStatus(skip: number) {
    switch (skip) {
      case 0:
        return EnumGitPullEventStatus.Ready;
      default:
        return EnumGitPullEventStatus.Deleted;
    }
  }
}
