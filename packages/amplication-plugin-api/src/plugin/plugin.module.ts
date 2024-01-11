import { NpmModule } from "../npm/npm.module";
import { PluginVersionModule } from "../pluginVersion/pluginVersion.module";
import { PluginModuleBase } from "./base/plugin.module.base";
import { GitPluginService } from "./github-plugin.service";
import { PluginResolver } from "./plugin.resolver";
import { PluginService } from "./plugin.service";
import { Module, forwardRef } from "@nestjs/common";

@Module({
  imports: [PluginModuleBase, forwardRef(() => PluginVersionModule), NpmModule],
  providers: [PluginService, PluginResolver, GitPluginService],
  exports: [PluginService],
})
export class PluginModule {}
