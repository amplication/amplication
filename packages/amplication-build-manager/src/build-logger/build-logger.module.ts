import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { BuildLoggerController } from "./build-logger.controller";
import { RedisService } from "../redis/redis.service";
import { BuildJobsHandlerModule } from "../build-job-handler/build-job-handler.module";
import { BuildLoggerService } from "./build-logger.service";

@Module({
  imports: [KafkaModule, BuildJobsHandlerModule],
  controllers: [BuildLoggerController],
  providers: [RedisService, BuildLoggerService],
  exports: [BuildLoggerService],
})
export class BuildLoggerModule {}
