import {
  DynamicModule,
  Global,
  Inject,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import { StorageService } from './storage.service';

import { STORAGE_MODULE_OPTIONS } from './storage.constants';
import { StorageModuleOptions, StorageOptionsFactory } from './interfaces';
import { ModuleRef } from '@nestjs/core';
import { StorageModuleAsyncOptions } from './interfaces/storage-module-async-options';
@Global()
@Module({})
export class StorageCoreModule {
  constructor(
    @Inject(STORAGE_MODULE_OPTIONS)
    private readonly options: StorageModuleOptions,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(options: StorageModuleOptions): DynamicModule {
    const storageModuleOptions: Provider = {
      provide: STORAGE_MODULE_OPTIONS,
      useValue: options,
    };

    return {
      module: StorageCoreModule,
      providers: [storageModuleOptions, StorageService],
      exports: [StorageService],
    };
  }

  static forRootAsync(options: StorageModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: StorageCoreModule,
      imports: options.imports,
      providers: [...asyncProviders, StorageService],
      exports: [StorageService],
    };
  }

  private static createAsyncProviders(
    options: StorageModuleAsyncOptions,
  ): Provider[] {
    if (options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<StorageOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: StorageModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: STORAGE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [options.useClass as Type<StorageOptionsFactory>];

    return {
      provide: STORAGE_MODULE_OPTIONS,
      useFactory: async (optionsFactory: StorageOptionsFactory) =>
        optionsFactory.createStorageOptions(),
      inject,
    };
  }
}
