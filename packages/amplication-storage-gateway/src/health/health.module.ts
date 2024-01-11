import { QueueModule } from "../queue/queue.module";
import { StorageModule } from "../storage/storage.module";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";
import { AmplicationLoggerModule } from "@amplication/util/nestjs/logging";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    QueueModule,
    StorageModule,
    AmplicationLoggerModule.forRoot({
      component: "storage-gateway-service",
    }),
  ],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
