import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { BuildLoggerController } from "./build-logger.controller";
import { BuildJobsHandlerService } from "../build-job-handler/build-job-handler.service";
import { RedisService } from "../redis/redis.service";

@Module({
  imports: [KafkaModule],
  controllers: [BuildLoggerController],
  providers: [BuildJobsHandlerService, RedisService],
})
export class BuildLoggerModule {}
