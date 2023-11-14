import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { BuildLoggerController } from "./build-logger.controller";
import { CodeGeneratorSplitterService } from "../code-generator/code-generator-splitter.service";
import { RedisService } from "../redis/redis.service";

@Module({
  imports: [KafkaModule],
  controllers: [BuildLoggerController],
  providers: [CodeGeneratorSplitterService, RedisService],
})
export class BuildLoggerModule {}
