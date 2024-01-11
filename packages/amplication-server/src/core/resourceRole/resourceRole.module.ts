import { PrismaModule } from "../../prisma/prisma.module";
import { EntityModule } from "../entity/entity.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ResourceRoleResolver } from "./resourceRole.resolver";
import { ResourceRoleService } from "./resourceRole.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule, PermissionsModule, EntityModule],
  providers: [ResourceRoleService, ResourceRoleResolver],
  exports: [ResourceRoleService, ResourceRoleResolver],
})
export class ResourceRoleModule {}
