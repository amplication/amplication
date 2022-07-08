import { Module } from '@nestjs/common';
import { ServiceSettingsService } from './serviceSettings.service';
import { ServiceSettingsResolver } from './serviceSettings.resolver';
import { BlockModule } from '../block/block.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [BlockModule, PermissionsModule],
  providers: [ServiceSettingsService, ServiceSettingsResolver],
  exports: [ServiceSettingsService, ServiceSettingsResolver]
})
export class ServiceSettingsModule {}
