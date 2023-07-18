import { forwardRef, Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { UserModule } from "../user/user.module";
import { EntityModule } from "../entity/entity.module";
import { BlockModule } from "../block/block.module";
import { BuildModule } from "../build/build.module";
import { EnvironmentModule } from "../environment/environment.module";
import { ResourceService } from "./resource.service";
import { ResourceResolver } from "./resource.resolver";
import { CommitModule } from "../commit/commit.module";
import { ServiceSettingsModule } from "../serviceSettings/serviceSettings.module";
import { ProjectConfigurationSettingsModule } from "../projectConfigurationSettings/projectConfigurationSettings.module";
import { ProjectModule } from "../project/project.module";
import { ServiceTopicsModule } from "../serviceTopics/serviceTopics.module";
import { TopicModule } from "../topic/topic.module";
import { BillingModule } from "../billing/billing.module";
import { PluginInstallationModule } from "../pluginInstallation/pluginInstallation.module";

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
  ],
  providers: [ResourceService, ResourceResolver],
  exports: [ResourceService, ResourceResolver],
})
export class ResourceModule {}
