import { Module } from "@nestjs/common";
import { PluginModuleBase } from "./base/plugin.module.base";
import { PluginService } from "./plugin.service";
import { PluginResolver } from "./plugin.resolver";
import { GitPluginService } from "./github-plugin.service";

@Module({
  imports: [PluginModuleBase],
  providers: [PluginService, PluginResolver, GitPluginService],
  exports: [PluginService],
})
export class PluginModule {}
