import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Controller, Post } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { BuildRunnerService } from "./build-runner.service";
import { CodeGenerationFailureDto } from "./dto/CodeGenerationFailure";
import { CodeGenerationSuccessDto } from "./dto/CodeGenerationSuccess";
import {
  CodeGenerationRequest,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";
import { EnumJobStatus } from "../types";

@Controller("build-runner")
export class BuildRunnerController {
  constructor(
    private readonly buildRunnerService: BuildRunnerService,
    private readonly logger: AmplicationLogger
  ) {}

  @Post("code-generation-success")
  async onCodeGenerationSuccess(
    @Payload() dto: CodeGenerationSuccessDto
  ): Promise<void> {
    await this.buildRunnerService.processBuildResult(
      dto.resourceId,
      dto.buildId, // jobBuildId
      EnumJobStatus.Success
    );
  }

  @Post("code-generation-failure")
  async onCodeGenerationFailure(
    @Payload() dto: CodeGenerationFailureDto
  ): Promise<void> {
    await this.buildRunnerService.processBuildResult(
      dto.resourceId,
      dto.buildId, // jobBuildId
      EnumJobStatus.Failure,
      dto.error
    );
  }

  @EventPattern(KAFKA_TOPICS.CODE_GENERATION_REQUEST_TOPIC)
  async onCodeGenerationRequest(
    @Payload() message: CodeGenerationRequest.Value
  ): Promise<void> {
    this.logger.info("Code generation request received", {
      buildId: message.buildId,
      resourceId: message.resourceId,
    });

    await this.buildRunnerService.runBuild(
      message.resourceId,
      message.buildId,
      message.dsgResourceData
    );
  }
}
