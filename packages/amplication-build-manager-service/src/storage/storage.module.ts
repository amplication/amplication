import { Module } from '@nestjs/common';
import { S3StorageService } from './s3Storage.service';

export const S3_STORAGE_SERVICE = 'S3_STORAGE_SERVICE';

@Module({
  providers: [
    {
      provide: S3_STORAGE_SERVICE,
      useClass: S3StorageService,
    },
  ],
  exports: [
    {
      provide: S3_STORAGE_SERVICE,
      useClass: S3StorageService,
    },
  ],
})
export class StorageModule {}
