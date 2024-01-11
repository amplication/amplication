import { BuildJobsHandlerModule } from "../build-job-handler/build-job-handler.module";
import { RedisService } from "../redis/redis.service";
import { BuildLoggerController } from "./build-logger.controller";
import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";

@Module({
  imports: [KafkaModule, BuildJobsHandlerModule],
  controllers: [BuildLoggerController],
  providers: [RedisService],
})
export class BuildLoggerModule {}
