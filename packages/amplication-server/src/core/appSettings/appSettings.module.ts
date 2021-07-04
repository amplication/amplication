import { Module } from '@nestjs/common';
import { AppSettingsService } from './appSettings.service';
import { AppSettingsResolver } from './appSettings.resolver';
import { BlockModule } from '../block/block.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [BlockModule, PermissionsModule],
  providers: [AppSettingsService, AppSettingsResolver],
  exports: [AppSettingsService, AppSettingsResolver]
})
export class AppSettingsModule {}
