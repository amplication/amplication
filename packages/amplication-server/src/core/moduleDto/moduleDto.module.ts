import { Module, forwardRef } from "@nestjs/common";
import { ModuleDtoService } from "./moduleDto.service";
import { ModuleDtoResolver } from "./moduleDto.resolver";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { PrismaModule } from "../../prisma";
import { UserModule } from "../user/user.module";
import { BillingService } from "../billing/billing.service";
import { SegmentAnalyticsModule } from "../../services/segmentAnalytics/segmentAnalytics.module";
import { ResourceModule } from "../resource/resource.module";
@Module({
  imports: [
    UserModule,
    BlockModule,
    PermissionsModule,
    PrismaModule,
    SegmentAnalyticsModule,
    forwardRef(() => ResourceModule),
  ],
  providers: [ModuleDtoService, BillingService, ModuleDtoResolver],
  exports: [ModuleDtoService, ModuleDtoResolver],
})
export class ModuleDtoModule {}
