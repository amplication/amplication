import { Module } from '@nestjs/common';
import { ProjectConfigurationSettingsService } from './projectConfigurationSettings.service';

@Module({
  providers: [ProjectConfigurationSettingsService],
  exports: [ProjectConfigurationSettingsService]
})
export class ProjectConfigurationSettingsModule {}
