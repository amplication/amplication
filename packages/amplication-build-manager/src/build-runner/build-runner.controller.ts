import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Controller, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventPattern, Payload } from "@nestjs/microservices";
import axios from "axios";
import { Env } from "../env";
import { BuildRunnerService } from "./build-runner.service";
import { CodeGenerationFailureDto } from "./dto/CodeGenerationFailure";
import { CodeGenerationSuccessDto } from "./dto/CodeGenerationSuccess";
import {
  CodeGenerationFailure,
  CodeGenerationRequest,
  CodeGenerationSuccess,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";
import { CodeGeneratorService } from "../code-generator/code-generator-catalog.service";

@Controller("build-runner")
export class BuildRunnerController {
  constructor(
    private readonly configService: ConfigService<Env, true>,
    private readonly buildRunnerService: BuildRunnerService,
    private readonly codeGeneratorService: CodeGeneratorService,
    private readonly producerService: KafkaProducerService,
    private readonly logger: AmplicationLogger
  ) {}

  @Post("code-generation-success")
  async onCodeGenerationSuccess(
    @Payload() dto: CodeGenerationSuccessDto
  ): Promise<void> {
    const codeGeneratorVersion =
      await this.buildRunnerService.getCodeGeneratorVersion(dto.buildId);

    try {
      await this.buildRunnerService.copyFromJobToArtifact(
        dto.resourceId,
        dto.buildId
      );

      const successEvent: CodeGenerationSuccess.KafkaEvent = {
        key: null,
        value: { buildId: dto.buildId, codeGeneratorVersion },
      };

      await this.producerService.emitMessage(
        KAFKA_TOPICS.CODE_GENERATION_SUCCESS_TOPIC,
        successEvent
      );
    } catch (error) {
      this.logger.error(error.message, error);

      const failureEvent: CodeGenerationFailure.KafkaEvent = {
        key: null,
        value: { buildId: dto.buildId, error, codeGeneratorVersion },
      };

      await this.producerService.emitMessage(
        KAFKA_TOPICS.CODE_GENERATION_FAILURE_TOPIC,
        failureEvent
      );
    }
  }

  @Post("code-generation-failure")
  async onCodeGenerationFailure(
    @Payload() dto: CodeGenerationFailureDto
  ): Promise<void> {
    try {
      const codeGeneratorVersion =
        await this.buildRunnerService.getCodeGeneratorVersion(dto.buildId);

      const failureEvent: CodeGenerationFailure.KafkaEvent = {
        key: null,
        value: { buildId: dto.buildId, error: dto.error, codeGeneratorVersion },
      };

      await this.producerService.emitMessage(
        KAFKA_TOPICS.CODE_GENERATION_FAILURE_TOPIC,
        failureEvent
      );
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  @EventPattern(KAFKA_TOPICS.CODE_GENERATION_REQUEST_TOPIC)
  async onCodeGenerationRequest(
    @Payload() message: CodeGenerationRequest.Value
  ): Promise<void> {
    this.logger.info("Code generation request received", {
      buildId: message.buildId,
      resourceId: message.resourceId,
    });

    let containerImageTag: string;
    try {
      if (this.configService.get(Env.DSG_CATALOG_SERVICE_URL)) {
        containerImageTag =
          await this.codeGeneratorService.getCodeGeneratorVersion({
            codeGeneratorVersion:
              message.dsgResourceData.resourceInfo.codeGeneratorVersionOptions
                .codeGeneratorVersion,
            codeGeneratorStrategy:
              message.dsgResourceData.resourceInfo.codeGeneratorVersionOptions
                .codeGeneratorStrategy,
          });
      }

      await this.buildRunnerService.saveDsgResourceData(
        message.buildId,
        message.dsgResourceData,
        containerImageTag ?? null
      );

      const url = this.configService.get(Env.DSG_RUNNER_URL);
      try {
        await axios.post(url, {
          resourceId: message.resourceId,
          buildId: message.buildId,
          containerImageTag,
        });
      } catch (error) {
        throw new Error(error.message, {
          cause: {
            code: error.response?.status,
            message: error.response?.data?.message,
            data: error.config?.data,
          },
        });
      }
    } catch (error) {
      this.logger.error(error.message, error);

      const failureEvent: CodeGenerationFailure.KafkaEvent = {
        key: null,
        value: {
          buildId: message.buildId,
          error,
          codeGeneratorVersion: containerImageTag ?? null,
        },
      };

      await this.producerService.emitMessage(
        KAFKA_TOPICS.CODE_GENERATION_FAILURE_TOPIC,
        failureEvent
      );
    }
  }
}
