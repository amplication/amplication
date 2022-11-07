import {
  Get,
  Param,
  Res,
  Controller,
  UseInterceptors,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Response } from "express";
import { MorganInterceptor } from "nest-morgan";
import {
  BuildService,
  WINSTON_LEVEL_TO_ACTION_LOG_LEVEL,
} from "./build.service";
import { BuildResultNotFound } from "./errors/BuildResultNotFound";
import { BuildNotFoundError } from "./errors/BuildNotFoundError";
import { StepNotCompleteError } from "./errors/StepNotCompleteError";
import { StepNotFoundError } from "./errors/StepNotFoundError";
import { CanUserAccessArgs } from "./dto/CanUserAccessArgs";
import { plainToInstance } from "class-transformer";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { KafkaMessage } from "kafkajs";
import { ResultMessage } from "../queue/dto/ResultMessage";
import { StatusEnum } from "../queue/dto/StatusEnum";
import { EnvironmentVariables } from "@amplication/kafka";
import { SendPullRequestResponse } from "./dto/sendPullRequestResponse";
import { CodeGenerationSuccess } from "./dto/CodeGenerationSuccess";
import { Env } from "../../env";
import { EnumActionStepStatus } from "../action/dto";
import { CHECK_USER_ACCESS_TOPIC } from "../../constants";
import { ActionService } from "../action/action.service";
import { LogEntryDto } from "./dto/LogEntryDto";

const ZIP_MIME = "application/zip";
@Controller("generated-apps")
export class BuildController {
  constructor(
    private readonly buildService: BuildService,
    private readonly actionService: ActionService
  ) {}

  @Get(`/:id.zip`)
  @UseInterceptors(MorganInterceptor("combined"))
  async getGeneratedAppArchive(@Param("id") id: string, @Res() res: Response) {
    let stream: NodeJS.ReadableStream;
    try {
      stream = await this.buildService.download({ where: { id } });
    } catch (error) {
      if (error instanceof StepNotCompleteError) {
        throw new BadRequestException(error.message);
      }
      if (
        error instanceof BuildNotFoundError ||
        error instanceof BuildResultNotFound ||
        error instanceof StepNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
    res.set({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "Content-Type": ZIP_MIME,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "Content-Disposition": `attachment; filename="${id}.zip"`,
    });
    stream.pipe(res);
  }

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
    const args = plainToInstance(SendPullRequestResponse, message.value);
    await this.buildService.onCreatePRSuccess({ response: args });
  }

  @EventPattern(
    EnvironmentVariables.instance.get(Env.CREATE_PR_FAILURE_TOPIC, true)
  )
  async onCreatePRFailure(@Payload() message: KafkaMessage): Promise<void> {
    // const args = plainToInstance(SendPullRequestResponse, message.value);
    // await this.buildService.onCreatePRFailure(args);
  }

  @EventPattern(EnvironmentVariables.instance.get(Env.DSG_LOG_TOPIC, true))
  async onDsgLog(@Payload() message: KafkaMessage): Promise<void> {
    const logEntry = plainToInstance(LogEntryDto, message.value);
    const step = await this.buildService.getGenerateCodeStep(logEntry.buildId);
    await this.actionService.logByStepId(
      step.id,
      WINSTON_LEVEL_TO_ACTION_LOG_LEVEL[logEntry.level],
      logEntry.message
    );
  }
}
