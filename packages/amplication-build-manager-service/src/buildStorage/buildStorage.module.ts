import { Module } from '@nestjs/common';
import { CompressionModule } from '../compression/compression.module';
import { StorageModule } from '../storage/storage.module';
import { BuildStorageService } from './buildStorage.service';

@Module({
  imports: [CompressionModule, StorageModule],
  providers: [BuildStorageService],
  exports: [BuildStorageService],
})
export class BuildStorageModule {}
