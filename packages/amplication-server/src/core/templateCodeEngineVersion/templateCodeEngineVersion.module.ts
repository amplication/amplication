import { Module } from "@nestjs/common";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { TemplateCodeEngineVersionService } from "./templateCodeEngineVersion.service";

@Module({
  imports: [BlockModule, PermissionsModule],
  providers: [TemplateCodeEngineVersionService],
  exports: [TemplateCodeEngineVersionService],
})
export class TemplateCodeEngineVersionModule {}
