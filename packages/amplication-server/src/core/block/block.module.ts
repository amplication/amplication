import { Module } from "@nestjs/common";
import { BlockService } from "./block.service";
import { BlockResolver } from "./block.resolver";
import { PrismaModule } from "../../prisma/prisma.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { UserModule } from "../user/user.module";
import { DiffModule } from "../../services/diff.module";
import { BillingService } from "../billing/billing.service";

@Module({
  imports: [PrismaModule, UserModule, PermissionsModule, DiffModule],
  providers: [BlockService, BillingService, BlockResolver],
  exports: [BlockService, BlockResolver],
})
export class BlockModule {}
