import { Controller, Inject } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { plainToInstance } from "class-transformer";
import { ActionService } from "../action/action.service";
import { EnumActionStepStatus } from "../action/dto";
import { ReplyResultMessage } from "./dto/ReplyResultMessage";
import { ReplyStatusEnum } from "./dto/ReplyStatusEnum";
import { BuildService } from "./build.service";
import {
  CanUserAccessBuild,
  CodeGenerationFailure,
  CodeGenerationLog,
  CodeGenerationSuccess,
  CreatePrFailure,
  CreatePrLog,
  CreatePrSuccess,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";

import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { validate } from "class-validator";

@Controller("generated-apps")
export class BuildController {
  constructor(
    private readonly buildService: BuildService,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly actionService: ActionService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  @MessagePattern(KAFKA_TOPICS.CHECK_USER_ACCESS_TOPIC)
  async checkUserAccess(
    @Payload() message: CanUserAccessBuild.Value
  ): Promise<{ value: ReplyResultMessage<boolean> }> {
    const validArgs = plainToInstance(CanUserAccessBuild.Value, message);
    const isUserCanAccess = await this.buildService.canUserAccess(validArgs);
    return {
      value: {
        error: null,
        status: ReplyStatusEnum.Success,
        value: isUserCanAccess,
      },
    };
  }

  @EventPattern(KAFKA_TOPICS.CODE_GENERATION_SUCCESS_TOPIC)
  async onCodeGenerationSuccess(
    @Payload() message: CodeGenerationSuccess.Value
  ): Promise<void> {
    const args = plainToInstance(CodeGenerationSuccess.Value, message);
    await this.buildService.completeCodeGenerationStep(
      args.buildId,
      EnumActionStepStatus.Success,
      args.codeGeneratorVersion
    );
    await this.buildService.saveToGitProvider(args.buildId);
  }

  @EventPattern(KAFKA_TOPICS.CODE_GENERATION_FAILURE_TOPIC)
  async onCodeGenerationFailure(
    @Payload() message: CodeGenerationFailure.Value
  ): Promise<void> {
    const args = plainToInstance(CodeGenerationFailure.Value, message);

    const validationErrors = await validate(args);

    if (validationErrors.length > 0) {
      // Shallow error to avoid blocking the kafka message consumption of topic
      // TODO remove this validation code https://github.com/amplication/amplication/pull/7478/files#diff-d5c5677256d985fd177eb124cf83fff2f5a963d813363cfcbd21208d957233f7R67
      this.logger.error("Failed to decode kafka message", null, {
        validationErrors: validationErrors.map((error) =>
          error.toString().replace(/\n/g, " ")
        ),
      });
      return;
    }

    await this.buildService.completeCodeGenerationStep(
      args.buildId,
      EnumActionStepStatus.Failed,
      args.codeGeneratorVersion
    );
  }

  @EventPattern(KAFKA_TOPICS.CREATE_PR_SUCCESS_TOPIC)
  async onPullRequestCreated(
    @Payload() message: CreatePrSuccess.Value
  ): Promise<void> {
    try {
      const args = plainToInstance(CreatePrSuccess.Value, message);
      await this.buildService.onCreatePRSuccess(args);
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  @EventPattern(KAFKA_TOPICS.CREATE_PR_FAILURE_TOPIC)
  async onPullRequestFailure(
    @Payload() message: CreatePrFailure.Value
  ): Promise<void> {
    try {
      const args = plainToInstance(CreatePrFailure.Value, message);
      await this.buildService.onCreatePRFailure(args);
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  @EventPattern(KAFKA_TOPICS.DSG_LOG_TOPIC)
  async onDsgLog(@Payload() message: CodeGenerationLog.Value): Promise<void> {
    const logEntry = plainToInstance(CodeGenerationLog.Value, message);
    await this.buildService.onDsgLog(logEntry);
  }

  @EventPattern(KAFKA_TOPICS.CREATE_PR_LOG_TOPIC)
  async onCreatePullRequestLog(
    @Payload() message: CreatePrLog.Value
  ): Promise<void> {
    try {
      const logEntry = plainToInstance(CreatePrLog.Value, message);

      await this.buildService.onCreatePullRequestLog(logEntry);
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }
}
