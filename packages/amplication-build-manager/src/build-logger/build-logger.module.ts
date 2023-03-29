import { KafkaProducerModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { BuildLoggerController } from "./build-logger.controller";

@Module({
  imports: [KafkaProducerModule],
  controllers: [BuildLoggerController],
  providers: [],
})
export class BuildLoggerModule {}
