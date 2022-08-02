import { DynamicModule, Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import { LoggerMetadata, winstonConfigFactory } from "./config.factory";

export interface AmplicationLoggerModuleOptions {
  metadata: LoggerMetadata;
}

@Module({})
export class AmplicationLoggerModule {
  static register(options: AmplicationLoggerModuleOptions): DynamicModule {
    return WinstonModule.forRootAsync({
      useFactory: () =>
        winstonConfigFactory(
          process.env.NODE_ENV === "production",
          options.metadata
        ),
    });
  }
}
