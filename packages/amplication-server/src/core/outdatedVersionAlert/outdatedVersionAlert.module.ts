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

@Module({
  imports: [
    BlockModule,
    PrismaModule,
    PermissionsModule,
    UserModule,
    forwardRef(() => ResourceModule),
    forwardRef(() => CommitModule),
    PluginInstallationModule,
  ],
  providers: [OutdatedVersionAlertService, OutdatedVersionAlertResolver],
  exports: [OutdatedVersionAlertService, OutdatedVersionAlertResolver],
})
export class OutdatedVersionAlertModule {}
