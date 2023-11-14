import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { BuildRunnerController } from "./build-runner.controller";
import { BuildRunnerService } from "./build-runner.service";
import { CodeGeneratorService } from "../code-generator/code-generator-catalog.service";
import { CodeGeneratorSplitterService } from "../code-generator/code-generator-splitter.service";
import { RedisService } from "../redis/redis.service";

@Module({
  imports: [KafkaModule],
  controllers: [BuildRunnerController],
  providers: [
    BuildRunnerService,
    CodeGeneratorService,
    CodeGeneratorSplitterService,
    RedisService,
  ],
})
export class BuildRunnerModule {}
