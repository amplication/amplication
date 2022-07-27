import { EnvironmentVariables } from '@amplication/kafka';
import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { BuildContextStorageService } from './buildContextStorage/buildContextStorage.service';
import { BuildService } from './codeBuild/build.service';
import { CODE_BUILD_SERVICE } from './codeBuild/codeBuild.module';
import { GenerateResource } from './codeBuild/dto/GenerateResource';
import { BUILD_STATUS_TOPIC, GENERATE_RESOURCE_TOPIC } from './constants';
import { QueueService } from './queue/queue.service';
import { ConfigService } from '@nestjs/config';
import { BuildStatusEvent } from './codeBuild/dto/BuildStatusEvent';
import { BuildStatusEnum } from './codeBuild/dto/BuildStatusEnum';

@Controller()
export class AppController {
  private readonly buildStatusTopic: string;

  constructor(
    @Inject(CODE_BUILD_SERVICE) private readonly buildService: BuildService,
    private readonly queueService: QueueService,
    private readonly configService: ConfigService,
    private readonly buildContextStorage: BuildContextStorageService,
  ) {
    this.buildStatusTopic = this.configService.get<string>(BUILD_STATUS_TOPIC);
  }

  @EventPattern(
    EnvironmentVariables.instance.get(GENERATE_RESOURCE_TOPIC, true),
  )
  async receiveCodeGenRequest(@Payload() message: any) {
    const gr: GenerateResource = message.value || {};
    try {
      const path = await this.buildContextStorage.saveBuildContextSource(gr);
      const runResponse = await this.buildService.runBuild(path);
      this.emitInitMessage(runResponse.runId, 'Generating code');
    } catch (error) {
      console.error(error);
      this.emitFailureMessage(gr.buildId, error.message);
    }
  }

  emitInitMessage(runId: string, message: string) {
    const event: BuildStatusEvent = {
      runId,
      status: BuildStatusEnum.Init,
      timestamp: new Date().toISOString(),
      message,
    };
    this.queueService.emitMessage(this.buildStatusTopic, JSON.stringify(event));
  }

  emitFailureMessage(buildId: string, message: string) {
    const event: BuildStatusEvent = {
      buildId,
      status: BuildStatusEnum.Failed,
      timestamp: new Date().toISOString(),
      message,
    };
    this.queueService.emitMessage(this.buildStatusTopic, JSON.stringify(event));
  }
}
