import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { BuildRunnerController } from "./build-runner.controller";
import { BuildRunnerService } from "./build-runner.service";
import { CodeGeneratorService } from "../code-generator/code-generator-catalog.service";
import { BuildJobsHandlerService } from "../build-job-handler/build-job-handler.service";
import { RedisService } from "../redis/redis.service";

@Module({
  imports: [KafkaModule],
  controllers: [BuildRunnerController],
  providers: [
    BuildRunnerService,
    CodeGeneratorService,
    BuildJobsHandlerService,
    RedisService,
  ],
})
export class BuildRunnerModule {}
