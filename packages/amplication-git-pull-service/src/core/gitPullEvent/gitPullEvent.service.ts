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

const ROOT_DIR = "ENV_ROOT_DIR";
const SKIP = "ENV_SKIP";

@Injectable()
export class GitPullEventService implements IGitPullEvent {
  rootDir: string;
  skip: number;
  constructor(
    private gitPullEventRepository: GitPullEventRepository,
    private storageService: StorageService,
    private readonly gitHostProviderFactory: GitHostProviderFactory,
    private gitClientService: GitClientService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {
    this.rootDir = this.configService.get<string>(ROOT_DIR) || os.homedir();
    this.skip = convertToNumber(this.configService.get<string>(SKIP) || "0");
  }

  async pushEventHandler(pushEventMessage: PushEventMessage): Promise<void> {
    const { provider, repositoryOwner, repositoryName, branch, commit } =
      pushEventMessage;

    const mainDir = `${this.rootDir}/git-remote/${provider}/${repositoryOwner}/${repositoryName}/${branch}`;
    const baseDir = `${mainDir}/${commit}`;

    try {
      const newRepository = await this.createNewRepository(pushEventMessage);

      const previousReadyCommit = await this.findPreviousReadyCommit(
        pushEventMessage
      );

      console.log({ previousReadyCommit }, "prev ready commit");

      if (!previousReadyCommit) {
        await this.cloneRepository(
          provider as GitProviderEnum,
          pushEventMessage,
          baseDir
        );

        await this.gitPullEventRepository.update(
          newRepository.id,
          EnumGitPullEventStatus.Ready
        );
      } else {
        await this.managePullEventStorage(
          pushEventMessage,
          previousReadyCommit.commit,
          mainDir,
          baseDir
        );
        await this.gitPullEventRepository.update(
          previousReadyCommit.id,
          this.skip === 0
            ? EnumGitPullEventStatus.Ready
            : EnumGitPullEventStatus.Deleted
        );
      }
    } catch (err: any) {
      this.logger.error(
        GitPullEventService.name,
        { err: err.message },
        LoggerMessages.error.CATCH_ERROR_MESSAGE,
        "pushEventHandler method"
      );
    }
  }

  private async createNewRepository(
    pushEventMessage: PushEventMessage
  ): Promise<{ id: bigint }> {
    const { installationId, ...gitPullEventParams } = pushEventMessage;
    const newRepository = await this.gitPullEventRepository.create({
      ...gitPullEventParams,
      status: EnumGitPullEventStatus.Created,
    });

    this.logger.log(
      LoggerMessages.log.NEW_REPOSITORY_WAS_CREATED,
      GitPullEventService.name,
      { newRepository }
    );

    return newRepository;
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
        this.skip
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

  private async managePullEventStorage(
    pushEventMessage: PushEventMessage,
    prevCommit: string,
    mainDir: string,
    baseDir: string
  ): Promise<void> {
    const { provider, installationId } = pushEventMessage;
    const accessToken = await this.gitHostProviderFactory
      .getHostProvider(provider as GitProviderEnum)
      .createInstallationAccessToken(installationId);

    const srcDir = `${mainDir}/${prevCommit}`;
    await this.storageService.copyDir(srcDir, baseDir);
    await this.gitClientService.pull(pushEventMessage, baseDir, accessToken);

    this.logger.log(
      LoggerMessages.log.PULL_COPY_SUCCESS,
      GitPullEventService.name
    );
  }
}
