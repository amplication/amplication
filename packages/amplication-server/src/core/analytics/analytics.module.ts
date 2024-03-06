import { Module } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { PrismaModule } from "../../prisma";

@Module({
  imports: [PrismaModule],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
