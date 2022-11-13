import { Injectable } from '@nestjs/common';
import {
  StorageOptionsFactory,
  StorageModuleOptions,
  StorageDiskConfig
} from '@codebrew/nestjs-storage';
import { LocalDiskService } from './local.disk.service';
import { GCSDiskService } from './gcs.disk.service';
import { ConfigService } from '@nestjs/config';

export const DEFAULT_DISK_VAR = 'DEFAULT_DISK';

export class UnknownDefaultDisk extends Error {
  constructor(disk: string) {
    super(`Unknown disk ${disk} was defined as default`);
  }
}

@Injectable()
export class StorageOptionsService implements StorageOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly localDiskService: LocalDiskService,
    private readonly gcsDiskService: GCSDiskService
  ) {}
  createStorageOptions(): StorageModuleOptions {
    const disks: Record<string, StorageDiskConfig> = {
      local: this.localDiskService.getDisk(),
      gcs: this.gcsDiskService.getDisk()
    };
    const defaultDisk = this.configService.get(DEFAULT_DISK_VAR);
    if (!disks[defaultDisk]) {
      throw new UnknownDefaultDisk(defaultDisk);
    }
    return {
      default: defaultDisk,
      disks
    };
  }
}
