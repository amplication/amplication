import { Module } from "@nestjs/common";
import { ExceptionFiltersModule } from "../filters/exceptionFilters.module";
import { AccountModule } from "./account/account.module";
import { WorkspaceModule } from "./workspace/workspace.module";
import { ResourceModule } from "./resource/resource.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { EntityModule } from "./entity/entity.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { ResourceRoleModule } from "./resourceRole/resourceRole.module";
import { BuildModule } from "./build/build.module";
import { ActionModule } from "./action/action.module";
import { EnvironmentModule } from "./environment/environment.module";
import { CommitModule } from "./commit/commit.module";
import { MailModule } from "./mail/mail.module";
import { ServiceSettingsModule } from "./serviceSettings/serviceSettings.module";
import { SubscriptionModule } from "./subscription/subscription.module";
import { GitProviderModule } from "./git/git.provider.module";
import { ProjectModule } from "./project/project.module";
import { HealthModule } from "./health/health.module";
import { PluginInstallationModule } from "./pluginInstallation/pluginInstallation.module";
import { TopicModule } from "./topic/topic.module";
import { ServiceTopicsModule } from "./serviceTopics/serviceTopics.module";
import { UserActionModule } from "./userAction/userAction.module";
import { DBSchemaImportModule } from "./dbSchemaImport/dbSchemaImport.module";
import { ModuleModule } from "./module/module.module";
import { ModuleActionModule } from "./moduleAction/moduleAction.module";
import { AdministratorModule } from "./administrator/administrator.module";
import { GptModule } from "./gpt/gpt.module";

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
    GptModule,
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
    GptModule,
  ],
})
export class CoreModule {}
