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
import { DeployerService } from "./deployer.service";
import { DEPLOYER_OPTIONS } from "./deployerOptions.token";

export type DeployerModuleOptions = {
  default: string;
  providers: Record<string, IProvider>;
};

export type DeployerModuleAsyncOptions = Pick<ModuleMetadata, "imports"> & {
  useFactory?: (
    ...args: any
  ) => DeployerModuleOptions | Promise<DeployerModuleOptions>;
  useClass?: Type<DeployerModuleOptions>;
  inject?: Array<Type<any> | string | symbol | Abstract<any> | Function>;
};

@Module({})
export class DeployerModule {
  static forRoot(options: DeployerModuleOptions): DynamicModule {
    return {
      module: DeployerModule,
      providers: [
        {
          provide: DEPLOYER_OPTIONS,
          useValue: { ...options, providers: {} },
        },
        DeployerService,
      ],
      exports: [DeployerService],
    };
  }
  static forRootAsync(options: DeployerModuleAsyncOptions): DynamicModule {
    const { imports, ...rest } = options;
    return {
      module: DeployerModule,
      providers: [
        // @ts-ignore
        {
          provide: DEPLOYER_OPTIONS,
          // @ts-ignore
          ...rest,
        },
        DeployerService,
      ],
      exports: [DeployerService],
      imports,
    };
  }
}
