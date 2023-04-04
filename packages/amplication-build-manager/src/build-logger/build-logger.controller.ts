import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { Body, Controller, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "../env";
import { OnCodeGenerationLogRequest } from "./dto/OnCodeGenerationLogRequest";

@Controller("build-logger")
export class BuildLoggerController {
  constructor(
    private readonly configService: ConfigService<Env, true>,
    private readonly producerService: KafkaProducerService
  ) {}

  @Post("create-log")
  async onCodeGenerationLog(
    @Body() logEntry: OnCodeGenerationLogRequest
  ): Promise<void> {
    await this.producerService.emitMessage(
      this.configService.get(Env.DSG_LOG_TOPIC),
      {
        key: logEntry.buildId,
        value: logEntry,
      }
    );
  }
}
