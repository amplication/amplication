import { Module } from "@nestjs/common";
import { ModuleService } from "./module.service";
import { ModuleResolver } from "./module.resolver";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { PrismaModule } from "../../prisma";

@Module({
  imports: [BlockModule, PermissionsModule, PrismaModule],
  providers: [ModuleService, ModuleResolver],
  exports: [ModuleService, ModuleResolver],
})
export class ModuleModule {}
