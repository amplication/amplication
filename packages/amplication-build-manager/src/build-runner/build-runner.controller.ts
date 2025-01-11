import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Controller, Post } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { BuildRunnerService } from "./build-runner.service";
import { CodeGenerationFailureDto } from "./dto/CodeGenerationFailure";
import { CodeGenerationSuccessDto } from "./dto/CodeGenerationSuccess";
import {
  CodeGenerationRequest,
  KAFKA_TOPICS,
  PackageManagerCreateSuccess,
  PackageManagerCreateFailure,
} from "@amplication/schema-registry";
import { plainToInstance } from "class-transformer";
import { NotifyPluginVersionDto } from "./dto/NotifyPluginVersion";

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
    await this.buildRunnerService.onCodeGenerationSuccess(dto);
  }

  @Post("notify-plugin-version")
  async onNotifyPluginVersion(
    @Payload() dto: NotifyPluginVersionDto
  ): Promise<void> {
    await this.buildRunnerService.emitBuildPluginNotifyVersion(dto);
  }

  @Post("code-generation-failure")
  async onCodeGenerationFailure(
    @Payload() dto: CodeGenerationFailureDto
  ): Promise<void> {
    await this.buildRunnerService.onCodeGenerationFailure(dto);
  }

  @EventPattern(KAFKA_TOPICS.PACKAGE_MANAGER_CREATE_SUCCESS)
  async onPackageManagerCreateSuccess(
    @Payload() message: PackageManagerCreateSuccess.Value
  ): Promise<void> {
    this.logger.info("Code package manager create success response received", {
      build: message.buildId,
    });
    const args = plainToInstance(PackageManagerCreateSuccess.Value, message);

    await this.buildRunnerService.onPackageManagerCreateSuccess(args);
  }

  @EventPattern(KAFKA_TOPICS.PACKAGE_MANAGER_CREATE_FAILURE)
  async onPackageManagerCreateFailure(
    @Payload() message: PackageManagerCreateFailure.Value
  ): Promise<void> {
    const args = plainToInstance(PackageManagerCreateFailure.Value, message);

    this.logger.info("Code package manager create failure response received", {
      error: args.errorMessage,
    });
    await this.buildRunnerService.onPackageManagerCreateFailure(args);
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
