import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ProjectConfigurationSettingsResolver } from "./projectConfigurationSettings.resolver";
import { ProjectConfigurationSettingsService } from "./projectConfigurationSettings.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [BlockModule, PermissionsModule],
  providers: [
    ProjectConfigurationSettingsService,
    ProjectConfigurationSettingsResolver,
  ],
  exports: [ProjectConfigurationSettingsService],
})
export class ProjectConfigurationSettingsModule {}
