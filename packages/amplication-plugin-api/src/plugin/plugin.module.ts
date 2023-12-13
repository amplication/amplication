import { Module, forwardRef } from "@nestjs/common";
import { PluginModuleBase } from "./base/plugin.module.base";
import { PluginService } from "./plugin.service";
import { PluginResolver } from "./plugin.resolver";
import { GitPluginService } from "./github-plugin.service";
import { PluginVersionModule } from "../pluginVersion/pluginVersion.module";
import { NpmModule } from "../npm/npm.module";

@Module({
  imports: [PluginModuleBase, forwardRef(() => PluginVersionModule), NpmModule],
  providers: [PluginService, PluginResolver, GitPluginService],
  exports: [PluginService],
})
export class PluginModule {}
