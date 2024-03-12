import { Module } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { PrismaModule } from "../../prisma";
import { AnalyticsResolver } from "./analytics.resolver";
import { PermissionsModule } from "../permissions/permissions.module";

@Module({
  imports: [PrismaModule, PermissionsModule],
  providers: [AnalyticsService, AnalyticsResolver],
  exports: [AnalyticsService, AnalyticsResolver],
})
export class AnalyticsModule {}
