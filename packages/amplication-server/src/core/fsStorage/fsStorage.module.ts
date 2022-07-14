import { Module } from '@nestjs/common';
import { FsStorageService } from './fsStorage.service';

@Module({
  controllers: [],
  providers: [FsStorageService],
  exports: [FsStorageService]
})
export class FsStorageModule {}
