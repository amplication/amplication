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
import { ContainerBuilderService } from "./containerBuilder.service";
import { CONTAINER_BUILDER_OPTIONS } from "./containerBuilderOptions.token";

export type ContainerBuilderModuleOptions = {
  default: string;
  providers: Record<string, IProvider>;
};

export type ContainerBuilderModuleAsyncOptions = Pick<
  ModuleMetadata,
  "imports"
> & {
  useFactory?: (
    ...args: any
  ) => ContainerBuilderModuleOptions | Promise<ContainerBuilderModuleOptions>;
  useClass?: Type<ContainerBuilderModuleOptions>;
  inject?: Array<Type<any> | string | symbol | Abstract<any> | Function>;
};

@Module({})
export class ContainerBuilderModule {
  static forRoot(options: ContainerBuilderModuleOptions): DynamicModule {
    return {
      module: ContainerBuilderModule,
      providers: [
        {
          provide: CONTAINER_BUILDER_OPTIONS,
          useValue: { ...options, providers: {} },
        },
        ContainerBuilderService,
      ],
      exports: [ContainerBuilderService],
    };
  }
  static forRootAsync(
    options: ContainerBuilderModuleAsyncOptions
  ): DynamicModule {
    const { imports, ...rest } = options;
    return {
      module: ContainerBuilderModule,
      providers: [
        // @ts-ignore
        {
          provide: CONTAINER_BUILDER_OPTIONS,
          // @ts-ignore
          ...rest,
        },
        ContainerBuilderService,
      ],
      exports: [ContainerBuilderService],
      imports,
    };
  }
}
