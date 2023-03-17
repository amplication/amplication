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
import { Env } from "../env";
import { CreatePullRequestArgs } from "./dto/create-pull-request.args";
import { PullRequestService } from "./pull-request.service";
import { KafkaTopics } from "./pull-request.type";
import { QueueService } from "./queue.service";

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
    @Payload() message: CreatePullRequestArgs,
    @Ctx() context: KafkaContext
  ) {
    const validArgs = plainToInstance(CreatePullRequestArgs, message);
    await validateOrReject(validArgs);

    const offset = context.getMessage().offset;
    const topic = context.getTopic();
    const partition = context.getPartition();

    this.logger.info(`Got a new generate pull request item from queue.`, {
      topic,
      partition,
      offset: context.getMessage().offset,
      class: this.constructor.name,
      args: validArgs,
    });

    try {
      const pullRequest = await this.pullRequestService.createPullRequest(
        validArgs
      );

      this.logger.info(`Finish process, committing`, {
        topic,
        partition,
        offset,
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
        offset,
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
