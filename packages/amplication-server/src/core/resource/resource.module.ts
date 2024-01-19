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
import { SubscriptionModule } from "../subscription/subscription.module";
import { ResourceBtmResolver } from "./resourceBtm.resolver";
import { ResourceBtmPromptService } from "./resourceBtmPrompt.service";
import { ResourceBtmService } from "./resourceBtm.service";
import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { UserAction } from "@amplication/schema-registry";
import { UserActionModule } from "../userAction/userAction.module";

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
    KafkaModule,
    UserActionModule,
  ],
  providers: [
    ResourceService,
    ResourceResolver,
    ResourceBtmResolver,
    ResourceBtmService,
    ResourceBtmPromptService,
  ],
  exports: [ResourceBtmService, ResourceService, ResourceResolver],
})
export class ResourceModule {}
