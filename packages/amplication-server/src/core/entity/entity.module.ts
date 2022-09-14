import { Module } from '@nestjs/common';
import { PrismaModule } from '@amplication/prisma-db';
import { JsonSchemaValidationModule } from '../../services/jsonSchemaValidation.module';
import { DiffModule } from '../../services/diff.module';
import { EntityService } from './entity.service';
import { EntityResolver } from './entity.resolver';
import { EntityVersionResolver } from './entityVersion.resolver';
import { PermissionsModule } from '../permissions/permissions.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PrismaModule,
    PermissionsModule,
    UserModule,
    JsonSchemaValidationModule,
    DiffModule
  ],
  providers: [EntityService, EntityResolver, EntityVersionResolver],
  exports: [EntityService, EntityResolver, EntityVersionResolver]
})
export class EntityModule {}
