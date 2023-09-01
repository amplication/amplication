import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { BuildRunnerController } from "./build-runner.controller";
import { BuildRunnerService } from "./build-runner.service";
import { CodeGeneratorService } from "../code-generator/code-generator-catalog.service";

@Module({
  imports: [KafkaModule],
  controllers: [BuildRunnerController],
  providers: [BuildRunnerService, CodeGeneratorService],
})
export class BuildRunnerModule {}
