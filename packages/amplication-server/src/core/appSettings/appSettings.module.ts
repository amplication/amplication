import { Module } from '@nestjs/common';
import { AppSettingsService } from './appSettings.service';
import { AppSettingsResolver } from './appSettings.resolver';
import { BlockModule } from '../block/block.module';

@Module({
  imports: [BlockModule],
  providers: [AppSettingsService, AppSettingsResolver],
  exports: [AppSettingsService, AppSettingsResolver]
})
export class AppSettingsModule {}
