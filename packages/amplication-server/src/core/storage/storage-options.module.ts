import { Module } from '@nestjs/common';
import { GCSDiskService } from './gcs.disk.service';
import { LocalDiskService } from './local.disk.service';
import { StorageOptionsService } from './storage-options.service';

@Module({
  providers: [GCSDiskService, LocalDiskService, StorageOptionsService],
  exports: [StorageOptionsService]
})
export class StorageOptionsModule {}
