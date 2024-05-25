import { Module } from "@nestjs/common";
import { ModuleService } from "./module.service";
import { ModuleResolver } from "./module.resolver";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { PrismaModule } from "../../prisma";
import { UserModule } from "../user/user.module";
import { ModuleActionModule } from "../moduleAction/moduleAction.module";
import { ModuleDtoModule } from "../moduleDto/moduleDto.module";
import { BillingService } from "../billing/billing.service";
import { SegmentAnalyticsModule } from "../../services/segmentAnalytics/segmentAnalytics.module";
@Module({
  imports: [
    UserModule,
    BlockModule,
    PermissionsModule,
    PrismaModule,
    ModuleActionModule,
    ModuleDtoModule,
    SegmentAnalyticsModule,
  ],
  providers: [ModuleService, BillingService, ModuleResolver],
  exports: [ModuleService, ModuleResolver],
})
export class ModuleModule {}
