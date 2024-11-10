import { forwardRef, Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { CommitModule } from "../commit/commit.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ResourceModule } from "../resource/resource.module";
import { UserModule } from "../user/user.module";
import { OutdatedVersionAlertResolver } from "./outdatedVersionAlert.resolver";
import { OutdatedVersionAlertService } from "./outdatedVersionAlert.service";
import { BlockModule } from "../block/block.module";
import { PluginInstallationModule } from "../pluginInstallation/pluginInstallation.module";
import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { ProjectModule } from "../project/project.module";
import { WorkspaceModule } from "../workspace/workspace.module";

@Module({
  imports: [
    BlockModule,
    PrismaModule,
    PermissionsModule,
    UserModule,
    forwardRef(() => ResourceModule),
    forwardRef(() => CommitModule),
    PluginInstallationModule,
    KafkaModule,
    forwardRef(() => ProjectModule),
    forwardRef(() => WorkspaceModule),
  ],
  providers: [OutdatedVersionAlertService, OutdatedVersionAlertResolver],
  exports: [OutdatedVersionAlertService, OutdatedVersionAlertResolver],
})
export class OutdatedVersionAlertModule {}
