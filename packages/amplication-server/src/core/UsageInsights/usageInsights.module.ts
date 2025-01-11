import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma";
import { UsageInsightsResolver } from "./usageInsights.resolver";
import { PermissionsModule } from "../permissions/permissions.module";
import { UsageInsightsService } from "./usageInsights.service";

@Module({
  imports: [PrismaModule, PermissionsModule],
  providers: [UsageInsightsService, UsageInsightsResolver],
  exports: [UsageInsightsService, UsageInsightsResolver],
})
export class UsageInsightsModule {}
