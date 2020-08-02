import { Module } from '@nestjs/common';
import { AppRoleService } from './appRole.service';
import { EntityService } from '../entity/entity.service';
import { AppRoleResolver } from './appRole.resolver';
import { PrismaModule } from 'src/services/prisma.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [PrismaModule, PermissionsModule],
  providers: [AppRoleService, AppRoleResolver, EntityService],
  exports: [AppRoleService, AppRoleResolver]
})
export class AppRoleModule {}
