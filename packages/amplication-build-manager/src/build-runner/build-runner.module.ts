import { BuildJobsHandlerModule } from "../build-job-handler/build-job-handler.module";
import { CodeGeneratorService } from "../code-generator/code-generator-catalog.service";
import { RedisService } from "../redis/redis.service";
import { BuildRunnerController } from "./build-runner.controller";
import { BuildRunnerService } from "./build-runner.service";
import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";

@Module({
  imports: [KafkaModule, BuildJobsHandlerModule],
  controllers: [BuildRunnerController],
  providers: [BuildRunnerService, CodeGeneratorService, RedisService],
})
export class BuildRunnerModule {}
