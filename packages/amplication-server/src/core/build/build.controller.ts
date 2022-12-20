import { Controller } from "@nestjs/common";
import { BuildService, ACTION_LOG_LEVEL } from "./build.service";
import { CanUserAccessArgs } from "./dto/CanUserAccessArgs";
import { plainToInstance } from "class-transformer";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { KafkaMessage } from "kafkajs";
import { ResultMessage } from "../queue/dto/ResultMessage";
import { StatusEnum } from "../queue/dto/StatusEnum";
import { EnvironmentVariables } from "@amplication/util/nestjs/kafka";
import { CreatePRSuccess } from "./dto/CreatePRSuccess";
import { CreatePRFailure } from "./dto/CreatePRFailure";
import { CodeGenerationSuccess } from "./dto/CodeGenerationSuccess";
import { Env } from "../../env";
import { EnumActionStepStatus } from "../action/dto";
import { CHECK_USER_ACCESS_TOPIC } from "../../constants";
import { ActionService } from "../action/action.service";
import { LogEntryDto } from "./dto/LogEntryDto";

@Controller("generated-apps")
export class BuildController {
  constructor(
    private readonly buildService: BuildService,
    private readonly actionService: ActionService
  ) {}

  @MessagePattern(
    EnvironmentVariables.instance.get(CHECK_USER_ACCESS_TOPIC, true)
  )
  async checkUserAccess(
    @Payload() message: KafkaMessage
  ): Promise<{ value: ResultMessage<boolean> }> {
    const validArgs = plainToInstance(CanUserAccessArgs, message.value);
    const isUserCanAccess = await this.buildService.canUserAccess(validArgs);
    return {
      value: {
        error: null,
        status: StatusEnum.Success,
        value: isUserCanAccess,
      },
    };
  }

  @EventPattern(
    EnvironmentVariables.instance.get(Env.CODE_GENERATION_SUCCESS_TOPIC, true)
  )
  async onCodeGenerationSuccess(
    @Payload() message: KafkaMessage
  ): Promise<void> {
    const args = plainToInstance(CodeGenerationSuccess, message.value);
    await this.buildService.completeCodeGenerationStep(
      args.buildId,
      EnumActionStepStatus.Success
    );
    await this.buildService.saveToGitHub(args.buildId);
  }

  @EventPattern(
    EnvironmentVariables.instance.get(Env.CODE_GENERATION_FAILURE_TOPIC, true)
  )
  async onCodeGenerationFailure(
    @Payload() message: KafkaMessage
  ): Promise<void> {
    const args = plainToInstance(CodeGenerationSuccess, message.value);
    await this.buildService.completeCodeGenerationStep(
      args.buildId,
      EnumActionStepStatus.Failed
    );
  }

  @EventPattern(
    EnvironmentVariables.instance.get(Env.CREATE_PR_SUCCESS_TOPIC, true)
  )
  async onPullRequestCreated(@Payload() message: KafkaMessage): Promise<void> {
    try {
      const args = plainToInstance(CreatePRSuccess, message.value);
      await this.buildService.onCreatePRSuccess(args);
    } catch (error) {
      console.error(error);
    }
  }

  @EventPattern(
    EnvironmentVariables.instance.get(Env.CREATE_PR_FAILURE_TOPIC, true)
  )
  async onCreatePRFailure(@Payload() message: KafkaMessage): Promise<void> {
    try {
      const args = plainToInstance(CreatePRFailure, message.value);
      await this.buildService.onCreatePRFailure(args);
    } catch (error) {
      console.error(error);
    }
  }

  @EventPattern(EnvironmentVariables.instance.get(Env.DSG_LOG_TOPIC, true))
  async onDsgLog(@Payload() message: KafkaMessage): Promise<void> {
    const logEntry = plainToInstance(LogEntryDto, message.value);
    const step = await this.buildService.getGenerateCodeStep(logEntry.buildId);
    await this.actionService.logByStepId(
      step.id,
      ACTION_LOG_LEVEL[logEntry.level],
      logEntry.message
    );
  }
}
