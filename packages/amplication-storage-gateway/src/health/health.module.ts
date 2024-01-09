import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";
import { QueueModule } from "../queue/queue.module";
import { AmplicationLoggerModule } from "@amplication/util/nestjs/logging";
import { StorageModule } from "../storage/storage.module";

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
