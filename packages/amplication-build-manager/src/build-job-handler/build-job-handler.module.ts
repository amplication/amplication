import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { BuildJobsHandlerService } from "../build-job-handler/build-job-handler.service";
import { RedisService } from "../redis/redis.service";
import { CodeGeneratorService } from "../code-generator/code-generator-catalog.service";

@Module({
  imports: [KafkaModule],
  controllers: [],
  providers: [BuildJobsHandlerService, RedisService, CodeGeneratorService],
  exports: [BuildJobsHandlerService],
})
export class BuildJobsHandlerModule {}
