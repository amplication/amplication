import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ResourceSettingsResolver } from "./resourceSettings.resolver";
import { ResourceSettingsService } from "./resourceSettings.service";

@Module({
  imports: [PrismaModule, BlockModule, PermissionsModule],
  providers: [ResourceSettingsService, ResourceSettingsResolver],
  exports: [ResourceSettingsService, ResourceSettingsResolver],
})
export class ResourceSettingsModule {}
