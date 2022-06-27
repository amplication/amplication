import { Module } from '@nestjs/common';
import { PrismaModule } from '@amplication/prisma-db';
import { PermissionsModule } from '../permissions/permissions.module';
import { EntityModule } from '../entity/entity.module';
import { ResourceRoleService } from './resourceRole.service';
import { ResourceRoleResolver } from './resourceRole.resolver';

@Module({
  imports: [PrismaModule, PermissionsModule, EntityModule],
  providers: [ResourceRoleService, ResourceRoleResolver],
  exports: [ResourceRoleService, ResourceRoleResolver]
})
export class ResourceRoleModule {}
