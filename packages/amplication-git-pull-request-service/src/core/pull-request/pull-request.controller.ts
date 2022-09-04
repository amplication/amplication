import {
  AmplicationLogger,
  AMPLICATION_LOGGER_PROVIDER,
} from '@amplication/nest-logger-module';
import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { KafkaMessage } from 'kafkajs';
import { GENERATE_PULL_REQUEST_TOPIC } from '../../constants';
import { EnvironmentVariables } from '../../services/environmentVariables';
import { ResultMessage } from './dto/ResultMessage';
import { SendPullRequestArgs } from './dto/sendPullRequest';
import { SendPullRequestResponse } from './dto/sendPullRequestResponse';
import { StatusEnum } from './dto/StatusEnum';
import { PullRequestService } from './pull-request.service';

@Controller()
export class PullRequestController {
  constructor(
    private readonly pullRequestService: PullRequestService,
    @Inject(AMPLICATION_LOGGER_PROVIDER)
    private readonly logger: AmplicationLogger
  ) {}
  @MessagePattern(EnvironmentVariables.get(GENERATE_PULL_REQUEST_TOPIC, true))
  async generatePullRequest(
    @Payload() message: KafkaMessage,
    @Ctx() context: KafkaContext
  ): Promise<{ value: ResultMessage<SendPullRequestResponse> }> {
    const validArgs = plainToInstance(SendPullRequestArgs, message.value);
    await validateOrReject(validArgs);
    this.logger.info(`Got a new generate pull request item from queue.`, {
      topic: context.getTopic(),
      partition: context.getPartition(),
      offset: message.offset,
      class: this.constructor.name,
      args: validArgs,
    });

    try {
      const pullRequest = await this.pullRequestService.createPullRequest(
        validArgs
      );
      this.logger.info(`Finish process, committing`, {
        topic: context.getTopic(),
        partition: context.getPartition(),
        offset: message.offset,
        class: this.constructor.name,
        buildId: validArgs.newBuildId,
      });
      return { value: pullRequest };
    } catch (error) {
      this.logger.error(error, {
        class: this.constructor.name,
        offset: message.offset,
        buildId: validArgs.newBuildId,
      });
      return {
        value: {
          value: null,
          status: StatusEnum.GeneralFail,
          error: error.message,
        },
      };
    }
  }
}
