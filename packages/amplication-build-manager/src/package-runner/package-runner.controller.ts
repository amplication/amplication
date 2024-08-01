import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Controller, Post } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { PackageRunnerService } from "./package-runner.service";
import {
  PackageManagerCreateResponse,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";

@Controller("package-runner")
export class PackageRunnerController {
  constructor(
    private readonly packageRunnerService: PackageRunnerService,
    private readonly logger: AmplicationLogger
  ) {}

  @EventPattern(KAFKA_TOPICS.PACKAGE_MANAGER_CREATE_RESPONSE)
  async onPackageManagerCreateResponse(
    @Payload() message: PackageManagerCreateResponse.Value
  ): Promise<void> {
    this.logger.info("Code package manager create response received", {
      files: message.files,
      resourceId: message.resourceId,
    });

    //handle files
  }
}
