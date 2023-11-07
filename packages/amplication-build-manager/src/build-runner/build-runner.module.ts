import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { BuildRunnerController } from "./build-runner.controller";
import { BuildRunnerService } from "./build-runner.service";
import { CodeGeneratorService } from "../code-generator/code-generator-catalog.service";
import { TarService } from "./tar.service";

@Module({
  imports: [KafkaModule],
  controllers: [BuildRunnerController],
  providers: [BuildRunnerService, CodeGeneratorService, TarService],
})
export class BuildRunnerModule {}
