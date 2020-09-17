import { DriverType, GoogleGcsStorageDisk } from '@codebrew/nestjs-storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const GCS_BUCKET_VAR = 'GCS_BUCKET';

@Injectable()
export class GCSDiskService {
  constructor(private readonly configService: ConfigService) {}
  getDisk(): GoogleGcsStorageDisk {
    const bucket = this.configService.get(GCS_BUCKET_VAR);
    return {
      driver: DriverType.GCS,
      config: {
        bucket,
        keyFilename: ''
      }
    };
  }
}
