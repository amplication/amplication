/**
 * Nest.js module
 */

import {
  Abstract,
  DynamicModule,
  Module,
  Type,
  ModuleMetadata,
} from "@nestjs/common";
import { IProvider } from "../types";
import { BuilderService } from "./builder.service";
import { BUILDER_OPTIONS } from "./builderOptions.token";

export type BuilderModuleOptions = {
  default: string;
  providers: Record<string, IProvider>;
};

export type BuilderModuleAsyncOptions = Pick<ModuleMetadata, "imports"> & {
  useFactory?: (
    ...args: any
  ) => BuilderModuleOptions | Promise<BuilderModuleOptions>;
  useClass?: Type<BuilderModuleOptions>;
  inject?: Array<Type<any> | string | symbol | Abstract<any> | Function>;
};

@Module({})
export class BuilderModule {
  static forRoot(options: BuilderModuleOptions): DynamicModule {
    return {
      module: BuilderModule,
      providers: [
        { provide: BUILDER_OPTIONS, useValue: { ...options, providers: {} } },
        BuilderService,
      ],
      exports: [BuilderService],
    };
  }
  static forRootAsync(options: BuilderModuleAsyncOptions): DynamicModule {
    const { imports, ...rest } = options;
    return {
      module: BuilderModule,
      providers: [
        // @ts-ignore
        { provide: BUILDER_OPTIONS, ...rest },
        BuilderService,
      ],
      exports: [BuilderService],
      imports,
    };
  }
}
