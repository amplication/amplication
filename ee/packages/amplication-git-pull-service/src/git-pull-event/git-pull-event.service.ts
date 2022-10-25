import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { EnumGitPullEventStatus, GitProviderEnum } from "../enums";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { LoggerMessages } from "../constants/logger-messages";
import { ConfigService } from "@nestjs/config";
import { convertToNumber } from "../utils/convert-to-number";
import { DEFAULT_GITHUB_PULL_FOLDER } from "../constants";
import {
  GitPullEvent,
  EventData,
  PushEventMessage,
  GitPullEventRepository,
  Storage,
  GitClient,
  GitHostProviderFactory,
} from "../interfaces";
const ROOT_STORAGE_DIR = "STORAGE_PATH";
const PRISMA_SKIP_VALUE = "MAX_SNAPSHOTS";

@Injectable()
export class GitPullEventService implements GitPullEvent {
  rootStorageDir: string;
  skipPrismaValue: number;
  constructor(
    private configService: ConfigService,
    @Inject("GitHostProviderFactory")
    private gitHostProviderFactory: GitHostProviderFactory,
    @Inject("GitPullEventRepository")
    private gitPullEventRepository: GitPullEventRepository,
    @Inject("IGitClient") private gitClientService: GitClient,
    @Inject("Storage") private storageService: Storage,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {
    this.rootStorageDir =
      this.configService.get<string>(ROOT_STORAGE_DIR) ||
      DEFAULT_GITHUB_PULL_FOLDER;
    this.skipPrismaValue = convertToNumber(
      this.configService.get<string>(PRISMA_SKIP_VALUE) || "0"
    );
  }

  async handlePushEvent(pushEventMessage: PushEventMessage): Promise<void> {
    const {
      provider,
      repositoryOwner,
      repositoryName,
      branch,
      commit,
    } = pushEventMessage;

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
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(
          GitPullEventService.name,
          { err: err.message },
          LoggerMessages.error.CATCH_ERROR_MESSAGE,
          "pushEventHandler method"
        );
      } else {
        console.log("Unexpected error", err);
      }
    }
  }

  private async createPullEventRecordOnDB(
    pushEventMessage: PushEventMessage
  ): Promise<{ id: bigint }> {
    const { ...gitPullEventParams } = pushEventMessage;
    const newPullEventRecord = await this.gitPullEventRepository.create({
      ...gitPullEventParams,
      status: EnumGitPullEventStatus.Created,
    });

    this.logger.log(
      LoggerMessages.log.NEW_GIT_PULL_EVENT_RECORD_CREATED,
      GitPullEventService.name,
      { newPullEventRecord }
    );

    return newPullEventRecord;
  }

  private async findPreviousReadyCommit(
    pushEventMessage: PushEventMessage
  ): Promise<EventData | undefined> {
    const {
      provider,
      repositoryOwner,
      repositoryName,
      branch,
      pushedAt,
    } = pushEventMessage;
    const previousReadyCommit = await this.gitPullEventRepository.findByPreviousReadyCommit(
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
      .getHostProvider(provider)
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
