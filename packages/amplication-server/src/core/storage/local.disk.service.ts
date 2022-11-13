import { DriverType, LocalStorageDisk } from '@codebrew/nestjs-storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const LOCAL_DISK_ROOT_VAR = 'LOCAL_DISK_ROOT';

@Injectable()
export class LocalDiskService {
  constructor(private readonly configService: ConfigService) {}
  getDisk(): LocalStorageDisk | null {
    const root = this.configService.get(LOCAL_DISK_ROOT_VAR);
    if (!root) {
      return null;
    }
    return {
      driver: DriverType.LOCAL,
      config: {
        root
      }
    };
  }
}
