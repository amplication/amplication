import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';
import { KafkaMessage } from 'kafkajs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { EnvironmentVariables } from 'src/services/environmentVariables';
import { Logger } from 'winston';
import { GENERATE_PULL_REQUEST_TOPIC } from '../../constants';
import { ResultMessage } from './dto/ResultMessage';
import { SendPullRequestArgs } from './dto/sendPullRequest';
import { SendPullRequestResponse } from './dto/sendPullRequestResponse';
import { StatusEnum } from './dto/StatusEnum';
import { PullRequestService } from './pull-request.service';

@Controller()
export class PullRequestController {
  constructor(
    private readonly pullRequestService: PullRequestService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}
  @MessagePattern(EnvironmentVariables.get(GENERATE_PULL_REQUEST_TOPIC, true))
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
    try {
      const validArgs = plainToClass(SendPullRequestArgs, message.value);
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
      this.logger.error(
        'Got an exception in pull request service and return error to kafka'
      );
      return { value: { value: null, status: StatusEnum.GeneralFail, error } };
    }
  }
}
