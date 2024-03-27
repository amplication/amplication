import { Module } from "@nestjs/common";
import { ModuleDtoService } from "./moduleDto.service";
import { ModuleDtoResolver } from "./moduleDto.resolver";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { PrismaModule } from "../../prisma";
import { UserModule } from "../user/user.module";
import { BillingService } from "../billing/billing.service";
@Module({
  imports: [UserModule, BlockModule, PermissionsModule, PrismaModule],
  providers: [ModuleDtoService, BillingService, ModuleDtoResolver],
  exports: [ModuleDtoService, ModuleDtoResolver],
})
export class ModuleDtoModule {}
