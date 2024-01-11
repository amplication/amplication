import { PrismaModule } from "../../prisma";
import { BlockModule } from "../block/block.module";
import { ModuleActionModule } from "../moduleAction/moduleAction.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { UserModule } from "../user/user.module";
import { ModuleResolver } from "./module.resolver";
import { ModuleService } from "./module.service";
import { Module } from "@nestjs/common";
@Module({
  imports: [
    UserModule,
    BlockModule,
    PermissionsModule,
    PrismaModule,
    ModuleActionModule,
  ],
  providers: [ModuleService, ModuleResolver],
  exports: [ModuleService, ModuleResolver],
})
export class ModuleModule {}
