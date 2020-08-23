import { StorageModuleOptions } from '@codebrew/nestjs-storage';
import { local } from './local.disk';

export const storageOptions: StorageModuleOptions = {
  default: 'local',
  disks: {
    local
  }
};
