import { EnvironmentVariables } from "@amplication/util/kafka";
import { Controller } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { plainToInstance } from "class-transformer";
import { CHECK_USER_ACCESS_TOPIC } from "../../constants";
import { Env } from "../../env";
import { ActionService } from "../action/action.service";
import { EnumActionStepStatus } from "../action/dto";
import { ResultMessage } from "../queue/dto/ResultMessage";
import { StatusEnum } from "../queue/dto/StatusEnum";
import { ACTION_LOG_LEVEL, BuildService } from "./build.service";
import { CanUserAccessArgs } from "./dto/CanUserAccessArgs";
import { CodeGenerationSuccess } from "./dto/CodeGenerationSuccess";
import { CreatePRFailure } from "./dto/CreatePRFailure";
import { CreatePRSuccess } from "./dto/CreatePRSuccess";
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
    @Payload() message: CanUserAccessArgs
  ): Promise<{ value: ResultMessage<boolean> }> {
    const validArgs = plainToInstance(CanUserAccessArgs, message);
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
    @Payload() message: CodeGenerationSuccess
  ): Promise<void> {
    const args = plainToInstance(CodeGenerationSuccess, message);
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
    @Payload() message: CodeGenerationSuccess
  ): Promise<void> {
    const args = plainToInstance(CodeGenerationSuccess, message);
    await this.buildService.completeCodeGenerationStep(
      args.buildId,
      EnumActionStepStatus.Failed
    );
  }

  @EventPattern(
    EnvironmentVariables.instance.get(Env.CREATE_PR_SUCCESS_TOPIC, true)
  )
  async onPullRequestCreated(
    @Payload() message: CreatePRSuccess
  ): Promise<void> {
    try {
      const args = plainToInstance(CreatePRSuccess, message);
      await this.buildService.onCreatePRSuccess(args);
    } catch (error) {
      console.error(error);
    }
  }

  @EventPattern(
    EnvironmentVariables.instance.get(Env.CREATE_PR_FAILURE_TOPIC, true)
  )
  async onCreatePRFailure(@Payload() message: CreatePRFailure): Promise<void> {
    try {
      const args = plainToInstance(CreatePRFailure, message);
      await this.buildService.onCreatePRFailure(args);
    } catch (error) {
      console.error(error);
    }
  }

  @EventPattern(EnvironmentVariables.instance.get(Env.DSG_LOG_TOPIC, true))
  async onDsgLog(@Payload() message: LogEntryDto): Promise<void> {
    const logEntry = plainToInstance(LogEntryDto, message);
    const step = await this.buildService.getGenerateCodeStep(logEntry.buildId);
    await this.actionService.logByStepId(
      step.id,
      ACTION_LOG_LEVEL[logEntry.level],
      logEntry.message
    );
  }
}
