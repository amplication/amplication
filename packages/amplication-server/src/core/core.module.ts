import { ExceptionFiltersModule } from "../filters/exceptionFilters.module";
import { AccountModule } from "./account/account.module";
import { ActionModule } from "./action/action.module";
import { AdministratorModule } from "./administrator/administrator.module";
import { AuthModule } from "./auth/auth.module";
import { BuildModule } from "./build/build.module";
import { CommitModule } from "./commit/commit.module";
import { DBSchemaImportModule } from "./dbSchemaImport/dbSchemaImport.module";
import { EntityModule } from "./entity/entity.module";
import { EnvironmentModule } from "./environment/environment.module";
import { GitProviderModule } from "./git/git.provider.module";
import { HealthModule } from "./health/health.module";
import { MailModule } from "./mail/mail.module";
import { ModuleModule } from "./module/module.module";
import { ModuleActionModule } from "./moduleAction/moduleAction.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { PluginInstallationModule } from "./pluginInstallation/pluginInstallation.module";
import { ProjectModule } from "./project/project.module";
import { ResourceModule } from "./resource/resource.module";
import { ResourceRoleModule } from "./resourceRole/resourceRole.module";
import { ServiceSettingsModule } from "./serviceSettings/serviceSettings.module";
import { ServiceTopicsModule } from "./serviceTopics/serviceTopics.module";
import { SubscriptionModule } from "./subscription/subscription.module";
import { TopicModule } from "./topic/topic.module";
import { UserModule } from "./user/user.module";
import { UserActionModule } from "./userAction/userActionModule";
import { WorkspaceModule } from "./workspace/workspace.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    AdministratorModule,
    AccountModule,
    WorkspaceModule,
    ResourceModule,
    UserModule,
    AuthModule,
    EntityModule,
    PermissionsModule,
    ExceptionFiltersModule,
    ResourceRoleModule,
    BuildModule,
    ActionModule,
    EnvironmentModule,
    CommitModule,
    ServiceSettingsModule,
    GitProviderModule,
    CommitModule,
    MailModule,
    SubscriptionModule,
    ProjectModule,
    HealthModule,
    PluginInstallationModule,
    TopicModule,
    ServiceTopicsModule,
    UserActionModule,
    DBSchemaImportModule,
    ModuleModule,
    ModuleActionModule,
  ],
  exports: [
    AccountModule,
    WorkspaceModule,
    ResourceModule,
    UserModule,
    AuthModule,
    EntityModule,
    PermissionsModule,
    ResourceRoleModule,
    BuildModule,
    ActionModule,
    EnvironmentModule,
    CommitModule,
    ServiceSettingsModule,
    GitProviderModule,
    CommitModule,
    MailModule,
    SubscriptionModule,
    ProjectModule,
    PluginInstallationModule,
    TopicModule,
    ServiceTopicsModule,
    UserActionModule,
    DBSchemaImportModule,
    ModuleModule,
    ModuleActionModule,
  ],
})
export class CoreModule {}
