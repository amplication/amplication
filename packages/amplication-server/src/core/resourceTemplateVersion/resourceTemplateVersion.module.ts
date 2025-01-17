import { Module } from "@nestjs/common";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ResourceTemplateVersionService } from "./resourceTemplateVersion.service";

@Module({
  imports: [BlockModule, PermissionsModule],
  providers: [ResourceTemplateVersionService],
  exports: [ResourceTemplateVersionService],
})
export class ResourceTemplateVersionModule {}
