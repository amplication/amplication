import { Module } from "@nestjs/common";
import { ModuleDtoService } from "./moduleDto.service";
import { ModuleDtoResolver } from "./moduleDto.resolver";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { PrismaModule } from "../../prisma";
import { UserModule } from "../user/user.module";
import { SegmentAnalyticsModule } from "../../services/segmentAnalytics/segmentAnalytics.module";
import { BillingModule } from "../billing/billing.module";
@Module({
  imports: [
    UserModule,
    BlockModule,
    PermissionsModule,
    PrismaModule,
    SegmentAnalyticsModule,
    BillingModule,
  ],
  providers: [ModuleDtoService, ModuleDtoResolver],
  exports: [ModuleDtoService, ModuleDtoResolver],
})
export class ModuleDtoModule {}
