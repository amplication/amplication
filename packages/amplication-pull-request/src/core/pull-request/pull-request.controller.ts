import {
  ResultMessage,
  SendPullRequestArgs,
  SendPullRequestResponse,
} from '@amplication/common';
import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';
import { config } from 'dotenv';
import { KafkaMessage } from 'kafkajs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { EnvironmentVariables } from 'src/utils/env';
import { Logger } from 'winston';
import { GENERATE_PULL_REQUEST_TOPIC } from '../../constants';
import { PullRequestService } from './pull-request.service';

config();

@Controller()
export class PullRequestController {
  constructor(
    private readonly pullRequestService: PullRequestService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}
  @MessagePattern(EnvironmentVariables.getStrict(GENERATE_PULL_REQUEST_TOPIC))
  async generatePullRequest(
    @Payload() message: KafkaMessage,
    @Ctx() context: KafkaContext
  ): Promise<{ value: ResultMessage<SendPullRequestResponse> }> {
    this.logger.info(`Got a new generate pull request item from queue.`, {
      topic: context.getTopic(),
      partition: context.getPartition(),
      offset: message.offset,
      class: this.constructor.name,
    });
    const validArgs = plainToClass(SendPullRequestArgs, message.value);
    const pullRequest = await this.pullRequestService.createPullRequest(
      validArgs
    );
    this.logger.info(`Finish process, committing`, {
      topic: context.getTopic(),
      partition: context.getPartition(),
      offset: message.offset,
    });
    return { value: pullRequest };
  }
}
