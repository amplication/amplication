import { Module } from "@nestjs/common";
import { ModuleDtoPropertyService } from "./moduleDtoProperty.service";
import { ModuleDtoPropertyResolver } from "./moduleDtoProperty.resolver";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { PrismaModule } from "../../prisma";
import { UserModule } from "../user/user.module";
@Module({
  imports: [UserModule, BlockModule, PermissionsModule, PrismaModule],
  providers: [ModuleDtoPropertyService, ModuleDtoPropertyResolver],
  exports: [ModuleDtoPropertyService, ModuleDtoPropertyResolver],
})
export class ModuleDtoPropertyModule {}
