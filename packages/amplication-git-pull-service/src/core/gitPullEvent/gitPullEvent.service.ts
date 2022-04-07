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
import { convertToNumber } from "../../utils/convertToNumber";

const ROOT_DIR = "ROOT_DIR_ENV";
const SKIP = "SKIP_ENV";

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
    this.rootDir = configService.get<string>(ROOT_DIR) || os.homedir();
    this.skip = configService.get<number>(SKIP) || 0;
  }

  async pushEventHandler(pushEventMessage: PushEventMessage): Promise<void> {
    const {
      provider,
      repositoryOwner,
      repositoryName,
      branch,
      commit,
      pushedAt,
    } = pushEventMessage;

    const mainDir = `${this.rootDir}/git-remote/${provider}/${repositoryOwner}/${repositoryName}/${branch}`;
    const baseDir = `${mainDir}/${commit}`;

    try {
      this.logger.log(
        "trying to create new repository",
        GitPullEventService.name
      );
      const { installationId, ...gitPullEventParams } = pushEventMessage;

      const newRepository = await this.gitPullEventRepository.create({
        ...gitPullEventParams,
        status: EnumGitPullEventStatus.Created,
      });

      this.logger.log(
        "succeeded to create new repository",
        GitPullEventService.name,
        { newRepository }
      );

      const previousReadyCommit =
        await this.gitPullEventRepository.findByPreviousReadyCommit(
          provider,
          repositoryOwner,
          repositoryName,
          branch,
          pushedAt,
          this.skip
        );

      this.logger.log("previousReadyCommit", GitPullEventService.name, {
        previousReadyCommit,
      });

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
          previousReadyCommit,
          mainDir,
          baseDir,
          branch,
          commit
        );
        await this.gitPullEventRepository.update(
          previousReadyCommit.id,
          this.skip === 0
            ? EnumGitPullEventStatus.Ready
            : EnumGitPullEventStatus.Deleted
        );
      }
    } catch (err) {
      this.logger.error(
        GitPullEventService.name,
        LoggerMessages.error.CATCH_ERROR_MESSAGE,
        { err }
      );
      console.log(err, "error!!!");
    }
  }

  private async cloneRepository(
    provider: GitProviderEnum,
    pushEventMessage: PushEventMessage,
    baseDir: string
  ) {
    const accessToken = await this.gitHostProviderFactory
      .getHostProvider(provider as GitProviderEnum)
      .createInstallationAccessToken(pushEventMessage.installationId);

    this.logger.log("accessToken was created", GitPullEventService.name, {
      accessToken,
    });

    await this.gitClientService.clone(pushEventMessage, baseDir, accessToken);

    this.logger.log("after clone", GitPullEventService.name, { accessToken });
  }

  private async managePullEventStorage(
    previousReadyCommit: EventData,
    mainDir: string,
    baseDir: string,
    branch: string,
    commit: string
  ) {
    const srcDir = `${mainDir}/${previousReadyCommit.commit}`;
    await this.storageService.copyDir(srcDir, baseDir);
    await this.gitClientService.pull(branch, commit, baseDir);
    this.logger.log("after pull and copy", GitPullEventService.name);
  }
}
