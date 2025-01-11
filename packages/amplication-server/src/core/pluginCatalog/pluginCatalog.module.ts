import { Module } from "@nestjs/common";
import { PluginCatalogService } from "./pluginCatalog.service";

@Module({
  imports: [],
  providers: [PluginCatalogService],
  exports: [PluginCatalogService],
})
export class PluginCatalogModule {}
