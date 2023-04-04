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
// import { CreatePullRequestArgs } from "./dto/create-pull-request.args";
import { PullRequestService } from "./pull-request.service";
import { KafkaTopics } from "./pull-request.type";
import { CreatePrRequestValue } from "@amplication/schema-registry";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";

@Controller()
export class PullRequestController {
  constructor(
    private readonly pullRequestService: PullRequestService,
    private readonly configService: ConfigService<Env, true>,
    private readonly producerService: KafkaProducerService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  @EventPattern(KafkaTopics.CreatePrRequest)
  async generatePullRequest(
    @Payload() message: CreatePrRequestValue,
    @Ctx() context: KafkaContext
  ) {
    const validArgs = plainToInstance(CreatePrRequestValue, message);
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

      await this.producerService.emitMessage(KafkaTopics.CreatePrSuccess, {
        key: null,
        value: response,
      });
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

      await this.producerService.emitMessage(KafkaTopics.CreatePrFailure, {
        key: null,
        value: response,
      });
    }
  }
}
