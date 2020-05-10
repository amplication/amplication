import { Module } from '@nestjs/common';

import { AccountModule } from '../core/account/account.module';
import { OrganizationModule } from '../core/organization/organization.module';
import { ProjectModule } from '../core/project/project.module';
import { UserModule } from '../core/user/user.module';
import { AuthModule } from '../core/Auth/auth.module';
import { EntityModule } from '../core/entity/entity.module';
import { EntityFieldModule } from '../core/entityField/entityField.module';
import { PermissionsModule } from '../core/permissions/permissions.module';
import { EntityVersionModule } from '../core/entityVersion/entityVersion.module';

@Module({
  imports: [
    AccountModule,
    OrganizationModule,
    ProjectModule,
    UserModule,
    AuthModule,
    EntityModule,
    EntityFieldModule,
    PermissionsModule,
    EntityVersionModule
  ],
  providers: [],
  exports: [
    AccountModule,
    OrganizationModule,
    ProjectModule,
    UserModule,
    AuthModule,
    EntityModule,
    EntityFieldModule,
    PermissionsModule,
    EntityVersionModule
  ]
})
export class CoreModule {}
