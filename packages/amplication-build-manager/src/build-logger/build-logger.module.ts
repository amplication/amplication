import { Module } from "@nestjs/common";
import { QueueModule } from "../queue/queue.module";
import { BuildLoggerController } from "./build-logger.controller";

@Module({
  imports: [QueueModule],
  controllers: [BuildLoggerController],
  providers: [],
})
export class BuildLoggerModule {}
