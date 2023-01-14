import { Module } from "@nestjs/common";
import { PluginVersionModuleBase } from "./base/pluginVersion.module.base";
import { PluginVersionService } from "./pluginVersion.service";
import { PluginVersionResolver } from "./pluginVersion.resolver";

@Module({
  imports: [PluginVersionModuleBase],
  providers: [PluginVersionService, PluginVersionResolver],
  exports: [PluginVersionService],
})
export class PluginVersionModule {}
