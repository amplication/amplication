import { Module } from '@nestjs/common';
import { ExceptionFiltersModule } from 'src/filters/exceptionFilters.module';
import { AccountModule } from './account/account.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { ResourceModule } from './resource/resource.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EntityModule } from './entity/entity.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ConnectorRestApiModule } from './connectorRestApi/connectorRestApi.module';
import { ConnectorRestApiCallModule } from './connectorRestApiCall/connectorRestApiCall.module';
import { EntityPageModule } from './entityPage/entityPage.module';
import { ResourceRoleModule } from './resourceRole/resourceRole.module';
import { BuildModule } from './build/build.module';
import { ActionModule } from './action/action.module';
import { EnvironmentModule } from './environment/environment.module';
import { CommitModule } from './commit/commit.module';
import { MailModule } from './mail/mail.module';
import { AppSettingsModule } from './appSettings/appSettings.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { GitModule } from '@amplication/git-service';
import { GitProviderModule } from './git/git.provider.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    AccountModule,
    WorkspaceModule,
    ResourceModule,
    UserModule,
    AuthModule,
    EntityModule,
    PermissionsModule,
    ExceptionFiltersModule,
    ConnectorRestApiModule,
    ConnectorRestApiCallModule,
    EntityPageModule,
    ResourceRoleModule,
    BuildModule,
    ActionModule,
    EnvironmentModule,
    CommitModule,
    AppSettingsModule,
    GitModule,
    GitProviderModule,
    CommitModule,
    MailModule,
    SubscriptionModule,
    HealthModule
  ],
  exports: [
    AccountModule,
    WorkspaceModule,
    ResourceModule,
    UserModule,
    AuthModule,
    EntityModule,
    PermissionsModule,
    ConnectorRestApiModule,
    ConnectorRestApiCallModule,
    EntityPageModule,
    ResourceRoleModule,
    BuildModule,
    ActionModule,
    EnvironmentModule,
    CommitModule,
    AppSettingsModule,
    GitProviderModule,
    GitModule,
    CommitModule,
    GitModule,
    MailModule,
    SubscriptionModule
  ]
})
export class CoreModule {}
