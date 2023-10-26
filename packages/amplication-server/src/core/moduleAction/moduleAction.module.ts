import { Module } from "@nestjs/common";
import { ModuleActionService } from "./moduleAction.service";
import { ModuleActionResolver } from "./moduleAction.resolver";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { PrismaModule } from "../../prisma";
import { UserModule } from "../user/user.module";
@Module({
  imports: [UserModule, BlockModule, PermissionsModule, PrismaModule],
  providers: [ModuleActionService, ModuleActionResolver],
  exports: [ModuleActionService, ModuleActionResolver],
})
export class ModuleActionModule {}
