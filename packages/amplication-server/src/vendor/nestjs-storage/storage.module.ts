import { DynamicModule, Module } from '@nestjs/common';

import { StorageModuleOptions } from './interfaces';
import { StorageCoreModule } from './storage-core.module';
import { StorageModuleAsyncOptions } from './interfaces/storage-module-async-options';

@Module({})
export class StorageModule {
  static forRoot(options: StorageModuleOptions): DynamicModule {
    return {
      module: StorageModule,
      imports: [StorageCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: StorageModuleAsyncOptions): DynamicModule {
    return {
      module: StorageModule,
      imports: [StorageCoreModule.forRootAsync(options)],
    };
  }
}
