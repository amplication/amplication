import { WinstonModule } from "nest-winston";
import { winstonConfigFactory } from "./config.factory";
import { ConfigurableModuleBuilder } from "@nestjs/common";

export interface AmplicationLoggerModuleOptions {
  service: string;
}

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} = new ConfigurableModuleBuilder<AmplicationLoggerModuleOptions>().build();

export const AmplicationLoggerModule = WinstonModule.forRootAsync({
  useFactory: () => winstonConfigFactory(process.env.NODE_ENV === "production"),
});
