import {
  GENERATE_PULL_REQUEST_MESSAGE,
  SendPullRequestArgs,
} from '@amplication/common';
import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { KafkaMessage } from 'kafkajs';
import { PullRequestService } from './pull-request.service';
import { plainToClass } from 'class-transformer';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
@Controller()
export class PullRequestController {
  constructor(
    private readonly pullRequestService: PullRequestService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}
  @MessagePattern(GENERATE_PULL_REQUEST_MESSAGE)
  async generatePullRequest({ value }: KafkaMessage) {
    this.logger.info('Got a new generate pull request item from queue.');
    const validArgs = plainToClass(SendPullRequestArgs, value);
    const pullRequest = await this.pullRequestService.createPullRequest(
      validArgs
    );
    return pullRequest;
  }
}
