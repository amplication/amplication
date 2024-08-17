import { Traceable } from "@amplication/opentelemetry-nestjs";
import { Injectable } from "@nestjs/common";
import { CodeGenerationLogRequestDto } from "./dto/OnCodeGenerationLogRequest";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { BuildJobsHandlerService } from "../build-job-handler/build-job-handler.service";
import { CodeGenerationLog, KAFKA_TOPICS } from "@amplication/schema-registry";

@Traceable()
@Injectable()
export class BuildLoggerService {
  constructor(
    private readonly producerService: KafkaProducerService,
    private readonly buildJobsHandlerService: BuildJobsHandlerService
  ) {}

  async addCodeGenerationLog(
    logEntry: CodeGenerationLogRequestDto
  ): Promise<void> {
    const buildId = this.buildJobsHandlerService.extractBuildId(
      logEntry.buildId
    );

    if (buildId !== logEntry.buildId) {
      const domain = this.buildJobsHandlerService.extractDomain(
        logEntry.buildId
      );
      logEntry.message = `[${domain}] ${logEntry.message}`;
    }

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
