import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BuildContextStorageService } from './buildContextStorage.service';

@Module({
  imports: [ConfigModule],
  providers: [BuildContextStorageService],
  exports: [BuildContextStorageService],
})
export class BuildContextStorageModule {}
