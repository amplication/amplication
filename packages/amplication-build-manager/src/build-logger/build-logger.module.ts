import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { BuildLoggerController } from "./build-logger.controller";
import { CodeGeneratorSplitterService } from "../code-generator/code-generator-splitter.service";

@Module({
  imports: [KafkaModule],
  controllers: [BuildLoggerController],
  providers: [CodeGeneratorSplitterService],
})
export class BuildLoggerModule {}
