import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  StorageOptionsFactory,
  StorageModuleOptions,
  DriverType
} from '@codebrew/nestjs-storage';
import { local } from './local.disk';

@Injectable()
export class StorageOptionsService implements StorageOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createStorageOptions(): StorageModuleOptions {
    return {
      default: 'local',
      disks: {
        local: {
          driver: DriverType.LOCAL,
          config: local
        }
      }
    };
  }
}
