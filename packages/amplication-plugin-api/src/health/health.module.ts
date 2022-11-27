import { Module } from "@nestjs/common";
import { PrismaModule } from "nestjs-prisma";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";

@Module({
  imports: [PrismaModule],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
