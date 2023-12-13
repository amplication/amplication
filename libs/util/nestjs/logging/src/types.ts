import { LogLevel } from "@amplication/util/logging";

export interface LoggerMetadata {
  service: string;
}

export const AMPLICATION_LOGGER_MODULE_OPTIONS =
  "AMPLICATION_LOGGER_MODULE_OPTIONS";

export interface AmplicationLoggerModulesOptions {
  component: string;
  logLevel?: LogLevel;
  isProduction?: boolean;
  metadata?: Record<string, unknown>;
}
