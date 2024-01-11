import { PrismaModule } from "../../prisma/prisma.module";
import { BillingModule } from "../billing/billing.module";
import { BlockModule } from "../block/block.module";
import { BuildModule } from "../build/build.module";
import { CommitModule } from "../commit/commit.module";
import { EntityModule } from "../entity/entity.module";
import { EnvironmentModule } from "../environment/environment.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { PluginInstallationModule } from "../pluginInstallation/pluginInstallation.module";
import { ProjectModule } from "../project/project.module";
import { ProjectConfigurationSettingsModule } from "../projectConfigurationSettings/projectConfigurationSettings.module";
import { ServiceSettingsModule } from "../serviceSettings/serviceSettings.module";
import { ServiceTopicsModule } from "../serviceTopics/serviceTopics.module";
import { SubscriptionModule } from "../subscription/subscription.module";
import { TopicModule } from "../topic/topic.module";
import { UserModule } from "../user/user.module";
import { ResourceResolver } from "./resource.resolver";
import { ResourceService } from "./resource.service";
import { forwardRef, Module } from "@nestjs/common";

@Module({
  imports: [
    PrismaModule,
    PermissionsModule,
    UserModule,
    EntityModule,
    ServiceSettingsModule,
    ServiceTopicsModule,
    TopicModule,
    forwardRef(() => BuildModule),
    EnvironmentModule,
    CommitModule,
    BlockModule,
    ProjectConfigurationSettingsModule,
    forwardRef(() => ProjectModule),
    BillingModule,
    PluginInstallationModule,
    SubscriptionModule,
  ],
  providers: [ResourceService, ResourceResolver],
  exports: [ResourceService, ResourceResolver],
})
export class ResourceModule {}
