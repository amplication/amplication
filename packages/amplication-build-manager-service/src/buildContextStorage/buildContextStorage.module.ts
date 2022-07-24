import { Module } from '@nestjs/common';
import { BuildContextStorageService } from './buildContextStorage.service';

@Module({
  providers: [BuildContextStorageService],
  exports: [BuildContextStorageService],
})
export class BuildContextStorageModule {}
