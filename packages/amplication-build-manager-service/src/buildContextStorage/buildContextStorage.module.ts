import { Module } from '@nestjs/common';
import { CompressionModule } from '../compression/compression.module';
import { StorageModule } from '../storage/storage.module';
import { BuildContextStorageService } from './buildContextStorage.service';

@Module({
  imports: [CompressionModule, StorageModule],
  providers: [BuildContextStorageService],
  exports: [BuildContextStorageService],
})
export class BuildContextStorageModule {}
