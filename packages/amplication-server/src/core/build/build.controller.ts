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
  CreatePrSuccess,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";

import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";

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
}
