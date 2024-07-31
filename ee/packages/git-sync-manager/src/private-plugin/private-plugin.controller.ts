import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Controller, Inject, LogLevel } from "@nestjs/common";
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from "@nestjs/microservices";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { PrivatePluginService } from "./private-plugin.service";
import {
  KafkaProducerService,
  KafkaPacemaker,
} from "@amplication/util/nestjs/kafka";
import {
  DownloadPrivatePluginsRequest,
  DownloadPrivatePluginsSuccess,
  DownloadPrivatePluginsFailure,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";

@Controller()
export class PrivatePluginController {
  constructor(
    private readonly privatePluginService: PrivatePluginService,
    private readonly producerService: KafkaProducerService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  private async log(
    buildId: string,
    level: LogLevel,
    message: string
  ): Promise<void> {
    await this.producerService.emitMessage(
      KAFKA_TOPICS.DOWNLOAD_PRIVATE_PLUGINS_LOG_TOPIC,
      {
        key: {
          buildId,
        },
        value: {
          buildId,
          level,
          message,
        },
      }
    );
  }

  @EventPattern(KAFKA_TOPICS.DOWNLOAD_PRIVATE_PLUGINS_REQUEST_TOPIC)
  async downloadPrivatePlugins(
    @Payload() message: DownloadPrivatePluginsRequest.Value,
    @Ctx() context: KafkaContext
  ) {
    const eventKey = plainToInstance(
      DownloadPrivatePluginsRequest.Key,
      context.getMessage().key.toString()
    );

    const validArgs = plainToInstance(
      DownloadPrivatePluginsRequest.Value,
      message
    );
    await validateOrReject(validArgs);

    try {
      const { pluginPaths } = await KafkaPacemaker.wrapLongRunningMethod<{
        pluginPaths: string[];
      }>(context, () =>
        this.privatePluginService.downloadPrivatePlugins(validArgs)
      );

      const successEvent: DownloadPrivatePluginsSuccess.KafkaEvent = {
        key: {
          resourceId: eventKey.resourceId,
        },
        value: {
          pluginPaths,
        },
      };
      await this.producerService.emitMessage(
        KAFKA_TOPICS.DOWNLOAD_PRIVATE_PLUGINS_SUCCESS_TOPIC,
        successEvent
      );
    } catch (error) {
      const failureEvent: DownloadPrivatePluginsFailure.KafkaEvent = {
        key: {
          resourceId: eventKey.resourceId,
        },
        value: {
          errorMessage: error.message,
        },
      };
      await this.producerService.emitMessage(
        KAFKA_TOPICS.DOWNLOAD_PRIVATE_PLUGINS_FAILURE_TOPIC,
        failureEvent
      );
    }
  }
}
