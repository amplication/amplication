import { PrismaModule } from "../../prisma";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { UserModule } from "../user/user.module";
import { ModuleActionResolver } from "./moduleAction.resolver";
import { ModuleActionService } from "./moduleAction.service";
import { Module } from "@nestjs/common";
@Module({
  imports: [UserModule, BlockModule, PermissionsModule, PrismaModule],
  providers: [ModuleActionService, ModuleActionResolver],
  exports: [ModuleActionService, ModuleActionResolver],
})
export class ModuleActionModule {}
