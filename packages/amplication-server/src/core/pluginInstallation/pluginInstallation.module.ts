import { Module } from "@nestjs/common";
import { PluginInstallationService } from "./pluginInstallation.service";
import { PluginOrderService } from "./pluginOrder.service";
import { PluginInstallationResolver } from "./pluginInstallation.resolver";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";

@Module({
  imports: [BlockModule, PermissionsModule],
  providers: [
    PluginInstallationService,
    PluginOrderService,
    PluginInstallationResolver,
  ],
  exports: [
    PluginInstallationService,
    PluginOrderService,
    PluginInstallationResolver,
  ],
})
export class PluginInstallationModule {}
