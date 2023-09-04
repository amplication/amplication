import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { convertToNumber } from "../utils/convert-to-number";
import { DEFAULT_GITHUB_PULL_FOLDER } from "./git-pull-event.constants";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { GitHostProviderFactory } from "./git-host-provider-factory";
import { GitPullEventRepository } from "./git-pull-event.repository";
import { GitClientService } from "./git-client.service";
import { StorageService } from "./storage.service";
import {
  EventData,
  GitProviderEnum,
  GitPullEventStatusEnum,
  PushEventMessage,
} from "./git-pull-event.types";
const ROOT_STORAGE_DIR = "STORAGE_PATH";
const PRISMA_SKIP_VALUE = "MAX_SNAPSHOTS";

@Injectable()
export class GitPullEventService {
  rootStorageDir: string;
  skipPrismaValue: number;
  constructor(
    private configService: ConfigService,
    private gitHostProviderFactory: GitHostProviderFactory,
    private gitPullEventRepository: GitPullEventRepository,
    private gitClientService: GitClientService,
    private storageService: StorageService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {
    this.rootStorageDir =
      this.configService.get<string>(ROOT_STORAGE_DIR) ||
      DEFAULT_GITHUB_PULL_FOLDER;
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
        GitPullEventStatusEnum.Ready
      );
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(
          "pushEventHandler method",
          err,
          GitPullEventService.name
        );
      } else {
        this.logger.error("Unexpected error", err, GitPullEventService.name);
      }
    }
  }

  private async createPullEventRecordOnDB(
    pushEventMessage: PushEventMessage
  ): Promise<{ id: bigint }> {
    const { ...gitPullEventParams } = pushEventMessage;
    const newPullEventRecord = await this.gitPullEventRepository.create({
      ...gitPullEventParams,
      status: GitPullEventStatusEnum.Created,
    });

    this.logger.log(
      "Git pull event has been recorded in the databsae",
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
      "Found an existing commit in Ready status",
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
      "Octokit access token generated",
      GitPullEventService.name,
      {
        accessToken,
      }
    );

    await this.gitClientService.clone(pushEventMessage, baseDir, accessToken);

    this.logger.log("Repository cloned successfully", GitPullEventService.name);
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

    this.logger.log("Repository pulled successfully", GitPullEventService.name);
  }

  private async copyPrevCommitDirToCurrCommitDir(
    repositoryDir: string,
    prevCommit: string,
    currentCommitDir: string
  ) {
    const prevCommitDir = `${repositoryDir}/${prevCommit}`;
    await this.storageService.copyDir(prevCommitDir, currentCommitDir);

    this.logger.log("Files copied successfully", GitPullEventService.name);
  }

  private async manageDelete(pullEventRecordId: bigint, dirToDelete: string) {
    await this.storageService.deleteDir(dirToDelete);
    this.logger.log("Files deleted successfully", GitPullEventService.name);

    await this.gitPullEventRepository.update(
      pullEventRecordId,
      GitPullEventStatusEnum.Deleted
    );

    this.logger.log("Repository has been archive", GitPullEventService.name);
  }
}
