import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { JsonSchemaValidationModule } from 'src/services/jsonSchemaValidation.module';
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
    JsonSchemaValidationModule
  ],
  providers: [EntityService, EntityResolver, EntityVersionResolver],
  exports: [EntityService, EntityResolver, EntityVersionResolver]
})
export class EntityModule {}
