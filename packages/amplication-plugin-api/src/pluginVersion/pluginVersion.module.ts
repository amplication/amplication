import { NpmModule } from "../npm/npm.module";
import { PluginModule } from "../plugin/plugin.module";
import { PluginVersionModuleBase } from "./base/pluginVersion.module.base";
import { NpmPluginVersionService } from "./npm-plugin-version.service";
import { PluginVersionResolver } from "./pluginVersion.resolver";
import { PluginVersionService } from "./pluginVersion.service";
import { forwardRef, Module } from "@nestjs/common";

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
