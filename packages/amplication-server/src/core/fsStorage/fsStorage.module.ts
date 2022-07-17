import { Module } from '@nestjs/common';
import { FsStorageService, FS_STORAGE_SERVICE } from './fsStorage.service';

@Module({
  controllers: [],
  providers: [
    {
      useClass: FsStorageService,
      provide: FS_STORAGE_SERVICE
    }
  ],
  exports: [
    {
      useClass: FsStorageService,
      provide: FS_STORAGE_SERVICE
    }
  ]
})
export class FsStorageModule {}
