import { Inject, Injectable } from '@nestjs/common';
import { Storage, StorageManager } from '@slynova/flydrive';

import { STORAGE_MODULE_OPTIONS } from './storage.constants';
import { StorageModuleOptions } from './interfaces';

@Injectable()
export class StorageService {
  private storageManager: StorageManager;

  constructor(
    @Inject(STORAGE_MODULE_OPTIONS) private options: StorageModuleOptions,
  ) {
    this.storageManager = new StorageManager(options);
  }

  getDisk<T extends Storage>(name?: string): T {
    return this.storageManager.disk<T>(name);
  }

  registerDriver(name: string, driver: new (...args: any[]) => Storage): void {
    this.storageManager.registerDriver(name, driver);
  }
}
