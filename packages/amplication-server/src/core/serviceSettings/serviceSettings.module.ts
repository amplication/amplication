import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ServiceSettingsResolver } from "./serviceSettings.resolver";
import { ServiceSettingsService } from "./serviceSettings.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [BlockModule, PermissionsModule],
  providers: [ServiceSettingsService, ServiceSettingsResolver],
  exports: [ServiceSettingsService, ServiceSettingsResolver],
})
export class ServiceSettingsModule {}
