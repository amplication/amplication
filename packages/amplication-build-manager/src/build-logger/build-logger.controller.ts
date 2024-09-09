import { Body, Controller, Post } from "@nestjs/common";
import { BuildLoggerService } from "./build-logger.service";
import { CodeGenerationLogRequestDto } from "./dto/OnCodeGenerationLogRequest";

@Controller("build-logger")
export class BuildLoggerController {
  constructor(private readonly buildLoggerService: BuildLoggerService) {}

  @Post("create-log")
  async onCodeGenerationLog(
    @Body() logEntry: CodeGenerationLogRequestDto
  ): Promise<void> {
    await this.buildLoggerService.addCodeGenerationLog(logEntry);
  }
}
