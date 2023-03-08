import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Controller, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from "@nestjs/microservices";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { KafkaMessage } from "kafkajs";
import { CreatePullRequestArgs } from "./dto/create-pull-request.args";
import { KafkaTopics } from "./pull-request.type";
import { PullRequestService } from "./pull-request.service";
import { QueueService } from "./queue.service";
import { Env } from "../env";

@Controller()
export class PullRequestController {
  constructor(
    private readonly pullRequestService: PullRequestService,
    private readonly configService: ConfigService<Env, true>,
    private readonly queueService: QueueService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  @EventPattern(KafkaTopics.CreatePrRequest)
  async generatePullRequest(
    @Payload() message: KafkaMessage,
    @Ctx() context: KafkaContext
  ) {
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

      const response = { url: pullRequest, buildId: validArgs.newBuildId };

      this.queueService.emitMessage(
        KafkaTopics.CreatePrSuccess,
        JSON.stringify(response)
      );
    } catch (error) {
      this.logger.error(error, {
        class: this.constructor.name,
        offset: message.offset,
        buildId: validArgs.newBuildId,
      });

      const response = {
        buildId: validArgs.newBuildId,
        errorMessage: error.message,
      };

      this.queueService.emitMessage(
        KafkaTopics.CreatePrFailure,
        JSON.stringify(response)
      );
    }
  }
}
