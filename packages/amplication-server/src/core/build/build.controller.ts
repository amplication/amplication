import { Controller, Inject } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { plainToInstance } from "class-transformer";
import { ActionService } from "../action/action.service";
import { ReplyResultMessage } from "./dto/ReplyResultMessage";
import { ReplyStatusEnum } from "./dto/ReplyStatusEnum";
import { BuildService } from "./build.service";
import {
  CanUserAccessBuild,
  CodeGenerationFailure,
  CodeGenerationLog,
  CodeGenerationSuccess,
  CreatePrFailure,
  CreatePrLog,
  CreatePrSuccess,
  KAFKA_TOPICS,
  DownloadPrivatePluginsFailure,
  DownloadPrivatePluginsLog,
  DownloadPrivatePluginsSuccess,
  CodeGenerationNotifyVersion,
  PluginNotifyVersion,
} from "@amplication/schema-registry";

import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";

@Controller("generated-apps")
export class BuildController {
  constructor(
    private readonly buildService: BuildService,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly actionService: ActionService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  @MessagePattern(KAFKA_TOPICS.CHECK_USER_ACCESS_TOPIC)
  async checkUserAccess(
    @Payload() message: CanUserAccessBuild.Value
  ): Promise<{ value: ReplyResultMessage<boolean> }> {
    const validArgs = plainToInstance(CanUserAccessBuild.Value, message);
    const isUserCanAccess = await this.buildService.canUserAccess(validArgs);
    return {
      value: {
        error: null,
        status: ReplyStatusEnum.Success,
        value: isUserCanAccess,
      },
    };
  }

  @EventPattern(KAFKA_TOPICS.CODE_GENERATION_NOTIFY_VERSION_TOPIC)
  async onCodeGenerationNotifyVersion(
    @Payload() message: CodeGenerationNotifyVersion.Value
  ): Promise<void> {
    const args = plainToInstance(CodeGenerationNotifyVersion.Value, message);
    try {
      await this.buildService.updateCodeGeneratorVersion(
        args.buildId,
        args.codeGeneratorVersion
      );
    } catch (error) {
      this.logger.error("Failed to update code generator version ", error, {
        buildId: args.buildId,
        codeGeneratorVersion: args.codeGeneratorVersion,
      });
    }
  }

  @EventPattern(KAFKA_TOPICS.BUILD_PLUGIN_NOTIFY_VERSION_TOPIC)
  async onPluginNotifyVersion(
    @Payload() message: PluginNotifyVersion.Value
  ): Promise<void> {
    const args = plainToInstance(PluginNotifyVersion.Value, message);
    try {
      await this.buildService.notifyBuildPluginVersion(args);
    } catch (error) {
      this.logger.error("Failed to update plugin version ", error, {
        buildId: args.buildId,
        requestedFullPackageName: args.requestedFullPackageName,
        packageName: args.packageName,
        packageVersion: args.packageVersion,
      });
    }
  }

  @EventPattern(KAFKA_TOPICS.CODE_GENERATION_SUCCESS_TOPIC)
  async onCodeGenerationSuccess(
    @Payload() message: CodeGenerationSuccess.Value
  ): Promise<void> {
    const args = plainToInstance(CodeGenerationSuccess.Value, message);
    try {
      await this.buildService.saveToGitProvider(args.buildId);

      await this.buildService.onCodeGenerationSuccess(args.buildId);
    } catch (error) {
      this.logger.error("Failed to Complete Code Generation Step ", error, {
        buildId: args.buildId,
      });
    }
  }

  @EventPattern(KAFKA_TOPICS.CODE_GENERATION_FAILURE_TOPIC)
  async onCodeGenerationFailure(
    @Payload() message: CodeGenerationFailure.Value
  ): Promise<void> {
    const args = plainToInstance(CodeGenerationFailure.Value, message);
    try {
      await this.buildService.onCodeGenerationFailure(args);
    } catch (error) {
      this.logger.error("Failed to execute onCodeGenerationFailure ", error, {
        buildId: args.buildId,
      });
    }
  }

  @EventPattern(KAFKA_TOPICS.CREATE_PR_SUCCESS_TOPIC)
  async onPullRequestCreated(
    @Payload() message: CreatePrSuccess.Value
  ): Promise<void> {
    try {
      const args = plainToInstance(CreatePrSuccess.Value, message);
      await this.buildService.onCreatePRSuccess(args);
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  @EventPattern(KAFKA_TOPICS.CREATE_PR_FAILURE_TOPIC)
  async onPullRequestFailure(
    @Payload() message: CreatePrFailure.Value
  ): Promise<void> {
    try {
      const args = plainToInstance(CreatePrFailure.Value, message);
      await this.buildService.onCreatePRFailure(args);
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  @EventPattern(KAFKA_TOPICS.DSG_LOG_TOPIC)
  async onDsgLog(@Payload() message: CodeGenerationLog.Value): Promise<void> {
    const logEntry = plainToInstance(CodeGenerationLog.Value, message);
    await this.buildService.onDsgLog(logEntry);
  }

  @EventPattern(KAFKA_TOPICS.CREATE_PR_LOG_TOPIC)
  async onCreatePullRequestLog(
    @Payload() message: CreatePrLog.Value
  ): Promise<void> {
    try {
      const logEntry = plainToInstance(CreatePrLog.Value, message);

      await this.buildService.onCreatePullRequestLog(logEntry);
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  @EventPattern(KAFKA_TOPICS.DOWNLOAD_PRIVATE_PLUGINS_SUCCESS_TOPIC)
  async onDownloadPrivatePluginsSuccess(
    @Payload() message: DownloadPrivatePluginsSuccess.Value
  ): Promise<void> {
    try {
      const args = plainToInstance(
        DownloadPrivatePluginsSuccess.Value,
        message
      );
      await this.buildService.onDownloadPrivatePluginSuccess(args);
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  @EventPattern(KAFKA_TOPICS.DOWNLOAD_PRIVATE_PLUGINS_FAILURE_TOPIC)
  async onDownloadPrivatePluginsFailure(
    @Payload() message: DownloadPrivatePluginsFailure.Value
  ): Promise<void> {
    try {
      const args = plainToInstance(
        DownloadPrivatePluginsFailure.Value,
        message
      );
      await this.buildService.onDownloadPrivatePluginFailure(args);
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  @EventPattern(KAFKA_TOPICS.DOWNLOAD_PRIVATE_PLUGINS_LOG_TOPIC)
  async onDownloadPrivatePluginsLog(
    @Payload() message: DownloadPrivatePluginsLog.Value
  ): Promise<void> {
    try {
      const logEntry = plainToInstance(
        DownloadPrivatePluginsLog.Value,
        message
      );

      await this.buildService.onDownloadPrivatePluginLog(logEntry);
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }
}
