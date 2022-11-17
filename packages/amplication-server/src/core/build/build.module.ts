import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ExceptionFiltersModule } from "../../filters/exceptionFilters.module";
import { PrismaModule } from "@amplication/prisma-db";
import { GqlAuthModule } from "../../guards/gql-auth.module";
import { EntityModule } from "../entity/entity.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { UserModule } from "../user/user.module";
import { ResourceRoleModule } from "../resourceRole/resourceRole.module";
import { ResourceModule } from "../resource/resource.module";
import { ServiceSettingsModule } from "../serviceSettings/serviceSettings.module";
import { BuildService } from "./build.service";
import { BuildResolver } from "./build.resolver";
import { BuildController } from "./build.controller";
import { RootStorageModule } from "../storage/root-storage.module";
import { ActionModule } from "../action/action.module";
import { StorageOptionsModule } from "../storage/storage-options.module";
import { BuildFilesSaver } from "./utils";
import { QueueModule } from "../queue/queue.module";
import { CommitModule } from "../commit/commit.module";
import { TopicModule } from "../topic/topic.module";
import { ServiceTopicsModule } from "../serviceTopics/serviceTopics.module";
import { PluginInstallationModule } from "../pluginInstallation/pluginInstallation.module";

@Module({
  imports: [
    ConfigModule,
    ExceptionFiltersModule,
    GqlAuthModule,
    EntityModule,
    PrismaModule,
    PermissionsModule,
    UserModule,
    RootStorageModule,
    ResourceRoleModule,
    ActionModule,
    StorageOptionsModule,
    forwardRef(() => ResourceModule),
    ServiceSettingsModule,
    QueueModule,
    PluginInstallationModule,
    forwardRef(() => CommitModule),
    TopicModule,
    ServiceTopicsModule,
  ],
  providers: [BuildService, BuildResolver, BuildFilesSaver],
  exports: [BuildService, BuildResolver],
  controllers: [BuildController],
})
export class BuildModule {}
