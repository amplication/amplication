import { Body, Controller, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LogEntry } from "winston";
import { Env } from "../env";
import { QueueService } from "../queue/queue.service";

@Controller("build-logger")
export class BuildLoggerController {
  constructor(
    private readonly configService: ConfigService<Env, true>,
    private readonly queueService: QueueService
  ) {}

  @Post("create-log")
  async completeCodeGenerationStep(@Body() logEntry: LogEntry): Promise<void> {
    await this.queueService.emitMessage(
      this.configService.get(Env.DSG_LOG_TOPIC),
      JSON.stringify(logEntry)
    );
  }
}
