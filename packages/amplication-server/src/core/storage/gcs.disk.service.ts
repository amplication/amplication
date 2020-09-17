import { DriverType, GoogleGcsStorageDisk } from '@codebrew/nestjs-storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const GCS_BUCKET_VAR = 'GCS_BUCKET';

@Injectable()
export class GCSDiskService {
  constructor(private readonly configService: ConfigService) {}
  getDisk(): GoogleGcsStorageDisk | null {
    const bucket = this.configService.get(GCS_BUCKET_VAR);
    if (!bucket) {
      return null;
    }
    return {
      driver: DriverType.GCS,
      config: {
        bucket,
        keyFilename: ''
      }
    };
  }
}
