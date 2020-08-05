import { Module } from '@nestjs/common';
import { EntityService } from './entity.service';
import { EntityResolver } from './EntityResolver';
import { PrismaModule } from 'src/services/prisma.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [PrismaModule, PermissionsModule],
  providers: [EntityService, EntityResolver],
  exports: [EntityService, EntityResolver]
})
export class EntityModule {}
