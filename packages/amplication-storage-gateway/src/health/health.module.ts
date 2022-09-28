import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";
import { QueueModule } from "../queue/queue.module";
import { AmplicationLoggerModule } from "@amplication/nest-logger-module";
import { StorageModule } from "../storage/storage.module";

@Module({
  imports: [
    QueueModule,
    StorageModule,
    AmplicationLoggerModule.register({
      metadata: { service: "storage-gateway-service" },
    }),
  ],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
