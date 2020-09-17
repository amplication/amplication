import { Injectable } from '@nestjs/common';
import {
  StorageOptionsFactory,
  StorageModuleOptions
} from '@codebrew/nestjs-storage';
import { local } from './local.disk';
import { GCSDiskService } from './gcs.disk.service';

@Injectable()
export class StorageOptionsService implements StorageOptionsFactory {
  constructor(private readonly gcsDiskService: GCSDiskService) {}
  createStorageOptions(): StorageModuleOptions {
    return {
      default: 'local',
      disks: {
        local,
        gcs: this.gcsDiskService.getDisk()
      }
    };
  }
}
