import { BuildJobsHandlerService } from "../build-job-handler/build-job-handler.service";
import { CodeGeneratorService } from "../code-generator/code-generator-catalog.service";
import { RedisService } from "../redis/redis.service";
import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";

@Module({
  imports: [KafkaModule],
  controllers: [],
  providers: [BuildJobsHandlerService, RedisService, CodeGeneratorService],
  exports: [BuildJobsHandlerService],
})
export class BuildJobsHandlerModule {}
