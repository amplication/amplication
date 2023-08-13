import { forwardRef, Module } from "@nestjs/common";
import { PluginVersionModuleBase } from "./base/pluginVersion.module.base";
import { PluginVersionService } from "./pluginVersion.service";
import { PluginVersionResolver } from "./pluginVersion.resolver";
import { NpmPluginVersionService } from "./npm-plugin-version.service";
import { PluginModule } from "../plugin/plugin.module";
import { NpmModule } from "../npm/npm.module";

@Module({
  imports: [PluginVersionModuleBase, forwardRef(() => PluginModule), NpmModule],
  providers: [
    PluginVersionService,
    PluginVersionResolver,
    NpmPluginVersionService,
  ],
  exports: [PluginVersionService],
})
export class PluginVersionModule {}
