import { Module } from '@nestjs/common';
import { ProjectConfigurationSettingsResolver } from './projectConfigurationSettings.resolver';
import { ProjectConfigurationSettingsService } from './projectConfigurationSettings.service';

@Module({
  providers: [
    ProjectConfigurationSettingsService,
    ProjectConfigurationSettingsResolver
  ],
  exports: [ProjectConfigurationSettingsService]
})
export class ProjectConfigurationSettingsModule {}
