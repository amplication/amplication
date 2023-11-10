import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { Body, Controller, Post } from "@nestjs/common";
import { CodeGenerationLogRequestDto } from "./dto/OnCodeGenerationLogRequest";
import { CodeGenerationLog, KAFKA_TOPICS } from "@amplication/schema-registry";
import { CodeGeneratorSplitterService } from "../code-generator/code-generator-splitter.service";
import { BuildId, JobBuildId } from "../types";

@Controller("build-logger")
export class BuildLoggerController {
  constructor(
    private readonly producerService: KafkaProducerService,
    private readonly codeGeneratorSplitterService: CodeGeneratorSplitterService
  ) {}

  @Post("create-log")
  async onCodeGenerationLog(
    @Body() logEntry: CodeGenerationLogRequestDto
  ): Promise<void> {
    const buildId = this.codeGeneratorSplitterService.extractBuildId(
      logEntry.buildId as JobBuildId<BuildId>
    );
    const logEvent: CodeGenerationLog.KafkaEvent = {
      key: { buildId },
      value: { ...logEntry, buildId },
    };
    await this.producerService.emitMessage(
      KAFKA_TOPICS.DSG_LOG_TOPIC,
      logEvent
    );
  }
}
