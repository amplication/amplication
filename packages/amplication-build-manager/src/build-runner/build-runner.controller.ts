import { Controller, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "../env";
import { QueueService } from "../queue/queue.service";
import { BuildRunnerService } from "./build-runner.service";
import { EnvironmentVariables } from "@amplication/util/kafka";
import { EventPattern, Payload } from "@nestjs/microservices";
import { KafkaMessage } from "kafkajs";
import { plainToInstance } from "class-transformer";
import { CodeGenerationRequest } from "./dto/CodeGenerationRequest";
import axios from "axios";
import { CodeGenerationSuccess } from "./dto/CodeGenerationSuccess";
import { CodeGenerationFailure } from "./dto/CodeGenerationFailure";

@Controller("build-runner")
export class BuildRunnerController {
  constructor(
    private readonly buildRunnerService: BuildRunnerService,
    private readonly configService: ConfigService<Env, true>,
    private readonly queueService: QueueService
  ) {}

  @Post("code-generation-success")
  async onCodeGenerationSuccess(
    @Payload() dto: CodeGenerationSuccess
  ): Promise<void> {
    try {
      await this.buildRunnerService.copyFromJobToArtifact(
        dto.resourceId,
        dto.buildId
      );
      await this.queueService.emitMessage(
        this.configService.get(Env.CODE_GENERATION_SUCCESS_TOPIC),
        JSON.stringify({ buildId: dto.buildId })
      );
    } catch (error) {
      console.error(error);
      await this.queueService.emitMessage(
        this.configService.get(Env.CODE_GENERATION_FAILURE_TOPIC),
        JSON.stringify({ buildId: dto.buildId, error })
      );
    }
  }

  @Post("code-generation-failure")
  async onCodeGenerationFailure(
    @Payload() dto: CodeGenerationFailure
  ): Promise<void> {
    try {
      await this.queueService.emitMessage(
        this.configService.get(Env.CODE_GENERATION_FAILURE_TOPIC),
        JSON.stringify({ buildId: dto.buildId, error: dto.error })
      );
    } catch (error) {
      console.error(error);
    }
  }

  @EventPattern(
    EnvironmentVariables.instance.get(Env.CODE_GENERATION_REQUEST_TOPIC, true)
  )
  async onCodeGenerationRequest(
    @Payload() message: KafkaMessage
  ): Promise<void> {
    console.log("Code generation request received");
    let args: CodeGenerationRequest;
    try {
      args = plainToInstance(CodeGenerationRequest, message.value);
      console.log("Code Generation Request", args);
      await this.buildRunnerService.saveDsgResourceData(
        args.buildId,
        args.dsgResourceData
      );
      const url = this.configService.get(Env.DSG_RUNNER_URL);
      await axios.post(url, {
        resourceId: args.resourceId,
        buildId: args.buildId,
      });
    } catch (error) {
      console.error(error);
      await this.queueService.emitMessage(
        this.configService.get(Env.CODE_GENERATION_FAILURE_TOPIC),
        JSON.stringify({ buildId: args?.buildId, error })
      );
    }
  }
}
