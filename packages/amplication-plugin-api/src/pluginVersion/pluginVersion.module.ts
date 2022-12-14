import { Module } from "@nestjs/common";
import { PluginVersionModuleBase } from "./base/pluginVersion.module.base";
import { PluginVersionService } from "./pluginVersion.service";
import { PluginVersionResolver } from "./pluginVersion.resolver";
import { NpmPluginVersionService } from "./npm-plugin-version.service";
import { PluginModule } from "../plugin/plugin.module";

@Module({
  imports: [PluginVersionModuleBase, PluginModule],
  providers: [
    PluginVersionService,
    PluginVersionResolver,
    NpmPluginVersionService,
  ],
  exports: [PluginVersionService],
})
export class PluginVersionModule {}
