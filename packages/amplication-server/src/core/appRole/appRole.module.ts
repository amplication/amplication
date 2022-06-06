import { Module } from '@nestjs/common';
import { PrismaModule } from '@amplication/prisma-db';
import { PermissionsModule } from '../permissions/permissions.module';
import { EntityModule } from '../entity/entity.module';
import { ResourceRoleService } from './appRole.service';
import { ResourceRoleResolver } from './appRole.resolver';

@Module({
  imports: [PrismaModule, PermissionsModule, EntityModule],
  providers: [ResourceRoleService, ResourceRoleResolver],
  exports: [ResourceRoleService, ResourceRoleResolver]
})
export class AppRoleModule {}
