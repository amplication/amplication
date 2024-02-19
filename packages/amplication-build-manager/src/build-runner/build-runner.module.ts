import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { BuildRunnerController } from "./build-runner.controller";
import { BuildRunnerService } from "./build-runner.service";
import { CodeGeneratorService } from "../code-generator/code-generator-catalog.service";
import { RedisService } from "../redis/redis.service";
import { BuildJobsHandlerModule } from "../build-job-handler/build-job-handler.module";

@Module({
  imports: [KafkaModule, BuildJobsHandlerModule],
  controllers: [BuildRunnerController],
  providers: [BuildRunnerService, CodeGeneratorService, RedisService],
})
export class BuildRunnerModule {}
