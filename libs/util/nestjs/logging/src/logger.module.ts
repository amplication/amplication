import { AmplicationLogger } from "./logger.service";
import {
  AmplicationLoggerModulesOptions,
  AMPLICATION_LOGGER_MODULE_OPTIONS,
} from "./types";
import { DynamicModule, Global, Module } from "@nestjs/common";

@Global()
@Module({})
export class AmplicationLoggerModule {
  static forRoot(options: AmplicationLoggerModulesOptions): DynamicModule {
    return {
      module: AmplicationLoggerModule,
      providers: [
        {
          provide: AMPLICATION_LOGGER_MODULE_OPTIONS,
          useValue: options,
        },
        AmplicationLogger,
      ],
      exports: [AmplicationLogger],
    };
  }
}
