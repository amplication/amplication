import { forwardRef, Module } from "@nestjs/common";
import { PluginInstallationService } from "./pluginInstallation.service";
import { PluginOrderService } from "./pluginOrder.service";
import { PluginInstallationResolver } from "./pluginInstallation.resolver";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ResourceModule } from "../resource/resource.module";

@Module({
  imports: [BlockModule, forwardRef(() => ResourceModule), PermissionsModule],
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
