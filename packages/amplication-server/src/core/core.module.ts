import { Module } from '@nestjs/common';

import { AccountModule } from '../core/account/account.module';
import { OrganizationModule } from '../core/organization/organization.module';
import { AppModule } from './app/app.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EntityModule } from './entity/entity.module';
import { EntityFieldModule } from './entityField/entityField.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    AccountModule,
    OrganizationModule,
    AppModule,
    UserModule,
    AuthModule,
    EntityModule,
    EntityFieldModule,
    PermissionsModule
  ],
  providers: [],
  exports: [
    AccountModule,
    OrganizationModule,
    AppModule,
    UserModule,
    AuthModule,
    EntityModule,
    EntityFieldModule,
    PermissionsModule
  ]
})
export class CoreModule {}
