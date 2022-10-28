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
import { ResultMessage } from './dto/result-message.dto';
import { CreatePullRequestArgs } from './dto/create-pull-request.args';
import { PullRequestResponse } from './dto/pull-request-response.dto';
import { KafkaTopics, StatusEnum } from './pull-request.type';
import { PullRequestService } from './pull-request.service';

@Controller()
export class PullRequestController {
  constructor(
    private readonly pullRequestService: PullRequestService,
    @Inject(AMPLICATION_LOGGER_PROVIDER)
    private readonly logger: AmplicationLogger
  ) {}
  @MessagePattern(KafkaTopics.GeneralPullRequest)
  async generatePullRequest(
    @Payload() message: KafkaMessage,
    @Ctx() context: KafkaContext
  ): Promise<{ value: ResultMessage<PullRequestResponse> }> {
    const validArgs = plainToInstance(CreatePullRequestArgs, message.value);
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
