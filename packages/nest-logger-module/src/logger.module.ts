import { DynamicModule, Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import { defaultMeta, winstonConfigFactory } from "./config.factory";

export type ModuleOptions = defaultMeta;

@Module({})
export class AmplicationLoggerModule {
  static register(options: ModuleOptions): DynamicModule {
    return WinstonModule.forRootAsync({
      useFactory: () =>
        winstonConfigFactory(process.env.NODE_ENV === "production", {
          ...options,
        }),
    });
  }
}
