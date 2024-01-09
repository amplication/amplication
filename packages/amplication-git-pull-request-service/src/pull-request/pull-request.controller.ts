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
import { PullRequestService } from "./pull-request.service";
import { KafkaTopics } from "./pull-request.type";
import {
  KafkaProducerService,
  KafkaPacemaker,
} from "@amplication/util/nestjs/kafka";
import {
  CreatePrFailure,
  CreatePrRequest,
  CreatePrSuccess,
} from "@amplication/schema-registry";

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
    @Payload() message: CreatePrRequest.Value,
    @Ctx() context: KafkaContext
  ) {
    const startTime = Date.now();
    const validArgs = plainToInstance(CreatePrRequest.Value, message);
    await validateOrReject(validArgs);

    const offset = context.getMessage().offset;
    const topic = context.getTopic();
    const partition = context.getPartition();
    const eventKey = plainToInstance(
      CreatePrRequest.Key,
      context.getMessage().key.toString()
    );
    const logger = this.logger.child({
      resourceId: validArgs.resourceId,
      buildId: validArgs.newBuildId,
    });

    logger.info(`Got a new generate pull request item from queue.`, {
      topic,
      partition,
      offset: context.getMessage().offset,
      class: this.constructor.name,
    });

    try {
      const pullRequest = await KafkaPacemaker.wrapLongRunningMethod<string>(
        context,
        () => this.pullRequestService.createPullRequest(validArgs)
      );

      logger.info(`Finish process, committing`, {
        topic,
        partition,
        offset,
        class: this.constructor.name,
      });

      const successEvent: CreatePrSuccess.KafkaEvent = {
        key: {
          resourceRepositoryId: eventKey.resourceRepositoryId,
        },
        value: {
          url: pullRequest,
          gitProvider: validArgs.gitProvider,
          buildId: validArgs.newBuildId,
        },
      };
      await this.producerService.emitMessage(
        KafkaTopics.CreatePrSuccess,
        successEvent
      );
    } catch (error) {
      logger.error(error.message, error, {
        class: PullRequestController.name,
        offset,
      });

      const failureEvent: CreatePrFailure.KafkaEvent = {
        key: {
          resourceRepositoryId: eventKey.resourceRepositoryId,
        },
        value: {
          buildId: validArgs.newBuildId,
          gitProvider: validArgs.gitProvider,
          errorMessage: error.message,
        },
      };

      await this.producerService.emitMessage(
        KafkaTopics.CreatePrFailure,
        failureEvent
      );
    }

    logger.info(`Pull request item processed`, {
      timeTaken: Date.now() - startTime,
    });
  }
}
