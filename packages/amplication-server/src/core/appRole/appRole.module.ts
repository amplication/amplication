import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { PermissionsModule } from '../permissions/permissions.module';
import { EntityModule } from '../entity/entity.module';
import { AppRoleService } from './appRole.service';
import { AppRoleResolver } from './appRole.resolver';

@Module({
  imports: [PrismaModule, PermissionsModule, EntityModule],
  providers: [AppRoleService, AppRoleResolver],
  exports: [AppRoleService, AppRoleResolver]
})
export class AppRoleModule {}
