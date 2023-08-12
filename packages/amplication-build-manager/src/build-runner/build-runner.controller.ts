import { EnvironmentVariables } from "@amplication/util/kafka";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Controller, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventPattern, Payload } from "@nestjs/microservices";
import axios from "axios";
import { plainToInstance } from "class-transformer";
import { Env } from "../env";
import { BuildRunnerService } from "./build-runner.service";
import { CodeGenerationFailureDto } from "./dto/CodeGenerationFailure";
import { CodeGenerationRequestDto } from "./dto/CodeGenerationRequest";
import { CodeGenerationSuccessDto } from "./dto/CodeGenerationSuccess";
import {
  CodeGenerationFailure,
  CodeGenerationSuccess,
} from "@amplication/schema-registry";

@Controller("build-runner")
export class BuildRunnerController {
  constructor(
    private readonly buildRunnerService: BuildRunnerService,
    private readonly configService: ConfigService<Env, true>,
    private readonly producerService: KafkaProducerService,
    private readonly logger: AmplicationLogger
  ) {}

  @Post("code-generation-success")
  async onCodeGenerationSuccess(
    @Payload() dto: CodeGenerationSuccessDto
  ): Promise<void> {
    try {
      await this.buildRunnerService.copyFromJobToArtifact(
        dto.resourceId,
        dto.buildId
      );

      const successEvent: CodeGenerationSuccess.KafkaEvent = {
        key: null,
        value: { buildId: dto.buildId },
      };

      await this.producerService.emitMessage(
        this.configService.get(Env.CODE_GENERATION_SUCCESS_TOPIC),
        successEvent
      );
    } catch (error) {
      this.logger.error(error.message, error);

      const failureEvent: CodeGenerationFailure.KafkaEvent = {
        key: null,
        value: { buildId: dto.buildId, error },
      };

      await this.producerService.emitMessage(
        this.configService.get(Env.CODE_GENERATION_FAILURE_TOPIC),
        failureEvent
      );
    }
  }

  @Post("code-generation-failure")
  async onCodeGenerationFailure(
    @Payload() dto: CodeGenerationFailureDto
  ): Promise<void> {
    try {
      const failureEvent: CodeGenerationFailure.KafkaEvent = {
        key: null,
        value: { buildId: dto.buildId, error: dto.error },
      };

      await this.producerService.emitMessage(
        this.configService.get(Env.CODE_GENERATION_FAILURE_TOPIC),
        failureEvent
      );
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  @EventPattern(
    EnvironmentVariables.instance.get(Env.CODE_GENERATION_REQUEST_TOPIC, true)
  )
  async onCodeGenerationRequest(
    @Payload() message: CodeGenerationRequestDto
  ): Promise<void> {
    this.logger.info("Code generation request received");
    let args: CodeGenerationRequestDto;
    try {
      args = plainToInstance(CodeGenerationRequestDto, message);
      this.logger.debug("Code Generation Request", args);
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
      this.logger.error(error.message, error);

      const failureEvent: CodeGenerationFailure.KafkaEvent = {
        key: null,
        value: { buildId: args.buildId, error },
      };

      await this.producerService.emitMessage(
        this.configService.get(Env.CODE_GENERATION_FAILURE_TOPIC),
        failureEvent
      );
    }
  }
}
