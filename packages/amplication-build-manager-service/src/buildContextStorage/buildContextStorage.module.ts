import { Module } from '@nestjs/common';
import { BuildContextStorageService } from './buildContextStorage.service';

@Module({
  imports: [],
  providers: [BuildContextStorageService],
  exports: [BuildContextStorageService],
})
export class BuildContextStorageModule {}
