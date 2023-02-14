import { Module, forwardRef } from "@nestjs/common";
import { PluginModuleBase } from "./base/plugin.module.base";
import { PluginService } from "./plugin.service";
import { PluginResolver } from "./plugin.resolver";
import { GitPluginService } from "./github-plugin.service";
import { PluginVersionModule } from "../pluginVersion/pluginVersion.module";

@Module({
  imports: [PluginModuleBase, forwardRef(() => PluginVersionModule)],
  providers: [PluginService, PluginResolver, GitPluginService],
  exports: [PluginService],
})
export class PluginModule {}
