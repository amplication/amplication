import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { BuildLoggerController } from "./build-logger.controller";
import { UtilsService } from "../utils.service";

@Module({
  imports: [KafkaModule],
  controllers: [BuildLoggerController],
  providers: [UtilsService],
})
export class BuildLoggerModule {}
