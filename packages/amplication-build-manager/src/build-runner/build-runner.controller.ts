import { Body, Controller, Put } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "../env";
import { QueueService } from "../queue/queue.service";
import { BuildRunnerService } from "./build-runner.service";
import { ActionStepStatus } from "./dto/ActionStepStatus";
import { CompleteCodeGenerationStep } from "./dto/CompleteCodeGenerationStep";
import { EnvironmentVariables } from "@amplication/kafka";
import { EventPattern, Payload } from "@nestjs/microservices";
import { KafkaMessage } from "kafkajs";
import { plainToInstance } from "class-transformer";
import { CreatePRRequest } from "./dto/CreatePRRequest";
import axios from "axios";

@Controller("build-runner")
export class BuildRunnerController {
  constructor(
    private readonly buildRunnerService: BuildRunnerService,
    private readonly configService: ConfigService<Env, true>,
    private readonly queueService: QueueService
  ) {}

  @Put("complete-code-generation-step")
  async completeCodeGenerationStep(
    @Body() dto: CompleteCodeGenerationStep
  ): Promise<void> {
    if (dto.status === ActionStepStatus.Success) {
      await this.buildRunnerService.copyFromJobToArtifact(dto.buildId);
      this.queueService.emitMessage(
        this.configService.get(Env.CODE_GENERATION_SUCCESS_TOPIC),
        JSON.stringify({ buildId: dto.buildId })
      );
    } else {
      this.queueService.emitMessage(
        this.configService.get(Env.CODE_GENERATION_FAILURE_TOPIC),
        JSON.stringify({ buildId: dto.buildId })
      );
    }
  }

  @EventPattern(
    EnvironmentVariables.instance.get(Env.CODE_GENERATION_REQUEST_TOPIC, true)
  )
  async onCreatePRRequest(@Payload() message: KafkaMessage): Promise<void> {
    const args = plainToInstance(CreatePRRequest, message.value);
    await this.buildRunnerService.saveDsgResourceData(
      args.buildId,
      args.dsgResourceData
    );
    const url = this.configService.get(Env.DSG_RUNNER_URL);
    await axios.post(url, {
      buildId: args.buildId,
    });
  }
}
