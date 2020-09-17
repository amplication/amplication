import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GCSDiskService } from './gcs.disk.service';
import { LocalDiskService } from './local.disk.service';
import { StorageOptionsService } from './storage-options.service';

@Module({
  imports: [ConfigModule],
  providers: [GCSDiskService, LocalDiskService, StorageOptionsService],
  exports: [GCSDiskService, LocalDiskService, StorageOptionsService]
})
export class StorageOptionsModule {}
