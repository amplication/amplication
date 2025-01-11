import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { RoleResolver } from "./role.resolver";
import { RoleService } from "./role.service";

@Module({
  imports: [PrismaModule, PermissionsModule],
  providers: [RoleResolver, RoleService],
  exports: [RoleResolver, RoleService],
})
export class RoleModule {}
