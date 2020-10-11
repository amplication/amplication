import { Module } from '@nestjs/common';

import { ExceptionFiltersModule } from 'src/filters/exceptionFilters.module';

import { AccountModule } from './account/account.module';
import { OrganizationModule } from './organization/organization.module';
import { AppModule } from './app/app.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EntityModule } from './entity/entity.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ConnectorRestApiModule } from './connectorRestApi/connectorRestApi.module';
import { ConnectorRestApiCallModule } from './connectorRestApiCall/connectorRestApiCall.module';
import { EntityPageModule } from './entityPage/entityPage.module';
import { AppRoleModule } from './appRole/appRole.module';
import { BuildModule } from './build/build.module';
import { ActionModule } from './action/action.module';
import { DeploymentModule } from './deployment/deployment.module';
import { EnvironmentModule } from './environment/environment.module';
@Module({
  imports: [
    AccountModule,
    OrganizationModule,
    AppModule,
    UserModule,
    AuthModule,
    EntityModule,
    PermissionsModule,
    ExceptionFiltersModule,
    ConnectorRestApiModule,
    ConnectorRestApiCallModule,
    EntityPageModule,
    AppRoleModule,
    BuildModule,
    ActionModule,
    DeploymentModule,
    EnvironmentModule
  ],
  providers: [],
  exports: [
    AccountModule,
    OrganizationModule,
    AppModule,
    UserModule,
    AuthModule,
    EntityModule,
    PermissionsModule,
    ConnectorRestApiModule,
    ConnectorRestApiCallModule,
    EntityPageModule,
    AppRoleModule,
    BuildModule,
    ActionModule,
    DeploymentModule,
    EnvironmentModule
  ]
})
export class CoreModule {}
