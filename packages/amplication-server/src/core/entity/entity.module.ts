import { Module } from '@nestjs/common';
import { EntityService } from './entity.service';
import { EntityResolver } from './entity.resolver';
import { EntityVersionResolver } from './entityVersion.resolver';
import { PrismaModule } from 'src/services/prisma.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, PermissionsModule, UserModule],
  providers: [EntityService, EntityResolver, EntityVersionResolver],
  exports: [EntityService, EntityResolver, EntityVersionResolver]
})
export class EntityModule {}
