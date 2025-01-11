import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ServiceSettingsResolver } from "./serviceSettings.resolver";
import { ServiceSettingsService } from "./serviceSettings.service";

@Module({
  imports: [PrismaModule, BlockModule, PermissionsModule],
  providers: [ServiceSettingsService, ServiceSettingsResolver],
  exports: [ServiceSettingsService, ServiceSettingsResolver],
})
export class ServiceSettingsModule {}
