import { Module } from '@nestjs/common';
import { PluginInstallationService } from './pluginInstallation.service';
import { PluginInstallationResolver } from './pluginInstallation.resolver';
import { BlockModule } from '../block/block.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [BlockModule, PermissionsModule],
  providers: [PluginInstallationService, PluginInstallationResolver],
  exports: [PluginInstallationService, PluginInstallationResolver]
})
export class PluginInstallationModule {}
