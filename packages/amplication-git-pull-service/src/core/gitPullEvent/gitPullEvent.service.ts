import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { GitPullEventRepository } from "../../databases/gitPullEvent.repository";
import { StorageService } from "../../providers/storage/storage.service";
import { GitClientService } from "../../providers/gitClient/gitClient.service";
import { IGitPullEvent } from "../../contracts/interfaces/gitPullEvent.interface";
import { EnumGitPullEventStatus } from "../../contracts/enums/gitPullEventStatus.enum";
import { GitHostProviderFactory } from "../../utils/gitHostProviderFactory/gitHostProviderFactory";
import { EventData } from "../../contracts/interfaces/eventData";
import { GitProviderEnum } from "../../contracts/enums/gitProvider.enum";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { LoggerMessages } from "../../constants/loggerMessages";
import { ConfigService } from "@nestjs/config";
import * as os from "os";
import { PushEventMessage } from "../../contracts/interfaces/pushEventMessage";
import { convertToNumber } from "src/utils/convertToNumber";

const ROOT_STORAGE_DIR = "ENV_ROOT_STORAGE_DIR";
const PRISMA_SKIP_VALUE = "ENV_PRISMA_SKIP_VALUE";

@Injectable()
export class GitPullEventService implements IGitPullEvent {
  rootStorageDir: string;
  skipPrismaValue: number;
  constructor(
    private gitPullEventRepository: GitPullEventRepository,
    private storageService: StorageService,
    private readonly gitHostProviderFactory: GitHostProviderFactory,
    private gitClientService: GitClientService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {
    this.rootStorageDir =
      this.configService.get<string>(ROOT_STORAGE_DIR) || os.homedir();
    this.skipPrismaValue = convertToNumber(
      this.configService.get<string>(PRISMA_SKIP_VALUE) || "0"
    );
  }

  async handlePushEvent(pushEventMessage: PushEventMessage): Promise<void> {
    const { provider, repositoryOwner, repositoryName, branch, commit } =
      pushEventMessage;

    const repositoryDir = `${this.rootStorageDir}/git-remote/${provider}/${repositoryOwner}/${repositoryName}/${branch}`;
    const currentCommitDir = `${repositoryDir}/${commit}`;

    try {
      const newPullEventRecord = await this.createPullEventRecordOnDB(
        pushEventMessage
      );

      const previousReadyCommit = await this.findPreviousReadyCommit(
        pushEventMessage
      );

      if (!previousReadyCommit) {
        await this.cloneRepository(
          provider as GitProviderEnum,
          pushEventMessage,
          currentCommitDir
        );
      } else {
        await this.copyPrevCommitDirToCurrCommitDir(
          repositoryDir,
          previousReadyCommit.commit,
          currentCommitDir
        );

        await this.pullRepository(pushEventMessage, currentCommitDir);

        if (this.skipPrismaValue !== 0) {
          await this.manageDelete(
            previousReadyCommit.id,
            `${repositoryDir}/${previousReadyCommit.commit}`
          );
        }
      }

      await this.gitPullEventRepository.update(
        newPullEventRecord.id,
        EnumGitPullEventStatus.Ready
      );
    } catch (err: any) {
      this.logger.error(
        GitPullEventService.name,
        { err: err.message },
        LoggerMessages.error.CATCH_ERROR_MESSAGE,
        "pushEventHandler method"
      );
    }
  }

  private async createPullEventRecordOnDB(
    pushEventMessage: PushEventMessage
  ): Promise<{ id: bigint }> {
    const { installationId, ...gitPullEventParams } = pushEventMessage;
    const newPullEventRecord = await this.gitPullEventRepository.create({
      ...gitPullEventParams,
      status: EnumGitPullEventStatus.Created,
    });

    this.logger.log(
      LoggerMessages.log.NEW_REPOSITORY_WAS_CREATED,
      GitPullEventService.name,
      { newPullEventRecord }
    );

    return newPullEventRecord;
  }

  private async findPreviousReadyCommit(
    pushEventMessage: PushEventMessage
  ): Promise<EventData | undefined> {
    const { provider, repositoryOwner, repositoryName, branch, pushedAt } =
      pushEventMessage;
    const previousReadyCommit =
      await this.gitPullEventRepository.findByPreviousReadyCommit(
        provider,
        repositoryOwner,
        repositoryName,
        branch,
        pushedAt,
        this.skipPrismaValue
      );

    this.logger.log(
      LoggerMessages.log.FOUND_PREVIOUS_READY_COMMIT,
      GitPullEventService.name,
      {
        previousReadyCommit,
      }
    );

    return previousReadyCommit;
  }

  private async cloneRepository(
    provider: GitProviderEnum,
    pushEventMessage: PushEventMessage,
    baseDir: string
  ): Promise<void> {
    const accessToken = await this.gitHostProviderFactory
      .getHostProvider(provider as GitProviderEnum)
      .createInstallationAccessToken(pushEventMessage.installationId);

    this.logger.log(
      LoggerMessages.log.GENERATE_OCTOKIT_ACCESS_TOKEN,
      GitPullEventService.name,
      {
        accessToken,
      }
    );

    await this.gitClientService.clone(pushEventMessage, baseDir, accessToken);

    this.logger.log(LoggerMessages.log.CLONE_SUCCESS, GitPullEventService.name);
  }

  private async pullRepository(
    pushEventMessage: PushEventMessage,
    currentCommitDir: string
  ): Promise<void> {
    const { provider, installationId } = pushEventMessage;
    const accessToken = await this.gitHostProviderFactory
      .getHostProvider(provider as GitProviderEnum)
      .createInstallationAccessToken(installationId);

    await this.gitClientService.pull(
      pushEventMessage,
      currentCommitDir,
      accessToken
    );

    this.logger.log(LoggerMessages.log.PULL_SUCCESS, GitPullEventService.name);
  }

  private async copyPrevCommitDirToCurrCommitDir(
    repositoryDir: string,
    prevCommit: string,
    currentCommitDir: string
  ) {
    const prevCommitDir = `${repositoryDir}/${prevCommit}`;
    await this.storageService.copyDir(prevCommitDir, currentCommitDir);

    this.logger.log(LoggerMessages.log.COPY_SUCCESS, GitPullEventService.name);
  }

  private async manageDelete(pullEventRecordId: bigint, dirToDelete: string) {
    this.storageService.deleteDir(dirToDelete);
    await this.gitPullEventRepository.update(
      pullEventRecordId,
      EnumGitPullEventStatus.Deleted
    );

    this.logger.log(
      LoggerMessages.log.DELETE_SUCCESSFULLY,
      GitPullEventService.name
    );
  }
}
