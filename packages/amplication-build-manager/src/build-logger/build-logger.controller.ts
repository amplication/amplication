import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { Body, Controller, Post } from "@nestjs/common";
import { CodeGenerationLogRequestDto } from "./dto/OnCodeGenerationLogRequest";
import { CodeGenerationLog, KAFKA_TOPICS } from "@amplication/schema-registry";

@Controller("build-logger")
export class BuildLoggerController {
  constructor(private readonly producerService: KafkaProducerService) {}

  @Post("create-log")
  async onCodeGenerationLog(
    @Body() logEntry: CodeGenerationLogRequestDto
  ): Promise<void> {
    const logEvent: CodeGenerationLog.KafkaEvent = {
      key: { buildId: logEntry.buildId },
      value: logEntry,
    };
    await this.producerService.emitMessage(
      KAFKA_TOPICS.DSG_LOG_TOPIC,
      logEvent
    );
  }
}
