import { Module } from "@nestjs/common";
import { ModuleActionService } from "./moduleAction.service";
import { ModuleActionResolver } from "./moduleAction.resolver";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { PrismaModule } from "../../prisma";
import { UserModule } from "../user/user.module";
import { BillingService } from "../billing/billing.service";
import { SegmentAnalyticsModule } from "../../services/segmentAnalytics/segmentAnalytics.module";
import { ModuleDtoModule } from "../moduleDto/moduleDto.module";
@Module({
  imports: [
    UserModule,
    BlockModule,
    PermissionsModule,
    PrismaModule,
    SegmentAnalyticsModule,
    ModuleDtoModule,
  ],
  providers: [ModuleActionService, BillingService, ModuleActionResolver],
  exports: [ModuleActionService, ModuleActionResolver],
})
export class ModuleActionModule {}
