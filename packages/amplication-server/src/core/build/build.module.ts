import { ExceptionFiltersModule } from "../../filters/exceptionFilters.module";
import { GqlAuthModule } from "../../guards/gql-auth.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { ActionModule } from "../action/action.module";
import { BillingModule } from "../billing/billing.module";
import { CommitModule } from "../commit/commit.module";
import { EntityModule } from "../entity/entity.module";
import { GitProviderModule } from "../git/git.provider.module";
import { ModuleModule } from "../module/module.module";
import { ModuleActionModule } from "../moduleAction/moduleAction.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { PluginInstallationModule } from "../pluginInstallation/pluginInstallation.module";
import { ResourceModule } from "../resource/resource.module";
import { ResourceRoleModule } from "../resourceRole/resourceRole.module";
import { ServiceSettingsModule } from "../serviceSettings/serviceSettings.module";
import { ServiceTopicsModule } from "../serviceTopics/serviceTopics.module";
import { TopicModule } from "../topic/topic.module";
import { UserModule } from "../user/user.module";
import { BuildController } from "./build.controller";
import { BuildResolver } from "./build.resolver";
import { BuildService } from "./build.service";
import { BuildFilesSaver } from "./utils";
import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule,
    ExceptionFiltersModule,
    GqlAuthModule,
    EntityModule,
    PrismaModule,
    PermissionsModule,
    UserModule,
    ResourceRoleModule,
    ActionModule,
    forwardRef(() => ResourceModule),
    ServiceSettingsModule,
    KafkaModule,
    PluginInstallationModule,
    forwardRef(() => CommitModule),
    TopicModule,
    ServiceTopicsModule,
    BillingModule,
    GitProviderModule,
    ModuleModule,
    ModuleActionModule,
  ],
  providers: [BuildService, BuildResolver, BuildFilesSaver],
  exports: [BuildService, BuildResolver],
  controllers: [BuildController],
})
export class BuildModule {}
