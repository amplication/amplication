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
import { PrivatePluginModule } from "./privatePlugin/privatePlugin.module";
import { TopicModule } from "./topic/topic.module";
import { ServiceTopicsModule } from "./serviceTopics/serviceTopics.module";
import { UserActionModule } from "./userAction/userAction.module";
import { DBSchemaImportModule } from "./dbSchemaImport/dbSchemaImport.module";
import { ModuleModule } from "./module/module.module";
import { ModuleActionModule } from "./moduleAction/moduleAction.module";
import { ModuleDtoModule } from "./moduleDto/moduleDto.module";
import { AdministratorModule } from "./administrator/administrator.module";
import { GptModule } from "./gpt/gpt.module";
import { UsageInsightsModule } from "./UsageInsights/usageInsights.module";
import { AssistantModule } from "./assistant/assistant.module";
import { AwsMarketplaceModule } from "./aws-marketplace/aws-marketplace.module";
import { PackageModule } from "./package/package.module";
import { ResourceVersionModule } from "./resourceVersion/resourceVersion.module";
import { OutdatedVersionAlertModule } from "./outdatedVersionAlert/outdatedVersionAlert.module";
import { TeamModule } from "./team/team.module";
import { CustomPropertyModule } from "./customProperty/customProperty.module";
import { BlueprintModule } from "./blueprint/blueprint.module";
import { RelationModule } from "./relation/relation.module";

@Module({
  imports: [
    AdministratorModule,
    UsageInsightsModule,
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
    ModuleDtoModule,
    GptModule,
    AssistantModule,
    AwsMarketplaceModule,
    PrivatePluginModule,
    PackageModule,
    ResourceVersionModule,
    OutdatedVersionAlertModule,
    TeamModule,
    CustomPropertyModule,
    BlueprintModule,
    RelationModule,
  ],
  exports: [
    AccountModule,
    UsageInsightsModule,
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
    ModuleDtoModule,
    GptModule,
    AssistantModule,
    PrivatePluginModule,
    ResourceVersionModule,
    OutdatedVersionAlertModule,
    TeamModule,
    CustomPropertyModule,
    BlueprintModule,
    RelationModule,
  ],
})
export class CoreModule {}
