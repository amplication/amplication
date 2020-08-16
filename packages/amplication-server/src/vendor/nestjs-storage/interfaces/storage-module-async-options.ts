import { ModuleMetadata, Type } from '@nestjs/common';
import { StorageModuleOptions } from './storage-module-options';
import { StorageOptionsFactory } from './storage-options-factory';

export interface StorageModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useFactory?: (
    ...args: any[]
  ) => Promise<StorageModuleOptions> | StorageModuleOptions;
  useClass?: Type<StorageOptionsFactory>;
  inject?: any[];
}
