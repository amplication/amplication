import { EnvironmentVariables } from '@amplication/kafka';
import { Controller, Inject, LoggerService } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { BuildStorageService } from './buildStorage/buildStorage.service';
import { BuildService } from './codeBuild/build.service';
import { CODE_BUILD_SERVICE } from './codeBuild/codeBuild.module';
import {
  BUILD_STATE_TOPIC,
  BUILD_STATUS_TOPIC,
  GENERATE_RESOURCE_TOPIC,
} from './constants';
import { QueueService } from './queue/queue.service';
import { ConfigService } from '@nestjs/config';
import {
  GenerateResource,
  BuildStatusEvent,
  BuildStatus,
} from '@amplication/build-types';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CodeGenNotification } from './codeBuild/dto/CodeBuildNotificationMessage';

@Controller()
export class AppController {
  private readonly buildStatusTopic: string;

  constructor(
    @Inject(CODE_BUILD_SERVICE) private readonly buildService: BuildService,
    private readonly queueService: QueueService,
    private readonly configService: ConfigService,
    private readonly buildStorage: BuildStorageService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.buildStatusTopic = this.configService.get<string>(BUILD_STATUS_TOPIC);
  }

  @EventPattern(
    EnvironmentVariables.instance.get(GENERATE_RESOURCE_TOPIC, true),
  )
  async receiveCodeGenRequest(@Payload() message: any) {
    const generateResource: GenerateResource = message.value || {};
    try {
      const path = await this.buildStorage.saveBuildContextSource(
        generateResource,
      );
      const runId = await this.buildService.runBuild(
        path,
        generateResource.resourceId,
        generateResource.buildId,
      );
      this.emitInitMessage(generateResource.buildId, runId, 'Generating code');
    } catch (error) {
      this.logger.error(
        `Failed to run code build: message: ${message} error: ${error}`,
        { error, class: QueueService.name, message },
      );
      this.emitFailureMessage(generateResource.buildId, error.message);
    }
  }

  @EventPattern(EnvironmentVariables.instance.get(BUILD_STATE_TOPIC, true))
  async receiveBuildState(@Payload() queueMessage: any) {
    try {
      const notification = queueMessage.value as CodeGenNotification;
      const event = this.buildService.mapBuildStateMessageToBuildStatusEvent(
        notification.Message,
      );
      this.queueService.emitMessage(
        this.buildStatusTopic,
        JSON.stringify(event),
      );
    } catch (error) {
      this.logger.error(
        `Failed to convert code build message to status event. message: ${queueMessage} error: ${error}`,
        { error, message: queueMessage },
      );
    }
  }

  @EventPattern(EnvironmentVariables.instance.get(BUILD_STATUS_TOPIC, true))
  async receiveBuildStatus(@Payload() queueMessage: any) {
    try {
      const event = queueMessage.value as BuildStatusEvent;
      switch (event.status) {
        case BuildStatus.Succeeded:
          const build = await this.buildService.getBuild(event.runId);
          await this.buildStorage.unpackArtifact(
            event.artifact,
            build.id,
            build.resourceId,
          );
          const readyEvent = { ...event, status: BuildStatus.Ready };
          this.queueService.emitMessage(
            this.buildStatusTopic,
            JSON.stringify(readyEvent),
          );
          break;
      }
    } catch (err) {
      this.logger.error(
        `Failed to process build status event. message: ${queueMessage} error: ${err}`,
        { error: err, message: queueMessage },
      );
    }
  }

  emitInitMessage(buildId: string, runId: string, message: string) {
    const event: BuildStatusEvent = {
      buildId,
      runId,
      status: BuildStatus.Init,
      timestamp: new Date().toISOString(),
      message,
    };
    this.queueService.emitMessage(this.buildStatusTopic, JSON.stringify(event));
  }

  emitFailureMessage(buildId: string, message: string) {
    const event: BuildStatusEvent = {
      buildId,
      status: BuildStatus.Failed,
      timestamp: new Date().toISOString(),
      message,
    };
    this.queueService.emitMessage(this.buildStatusTopic, JSON.stringify(event));
  }
}
