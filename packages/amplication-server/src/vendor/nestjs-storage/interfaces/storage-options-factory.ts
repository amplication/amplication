import { StorageModuleOptions } from './storage-module-options';

export interface StorageOptionsFactory {
  createStorageOptions(): Promise<StorageModuleOptions> | StorageModuleOptions;
}
