import { Format } from "logform";

export enum LogLevel {
  Debug = "debug",
  Info = "info",
  Warn = "warn",
  Error = "error",
}

export interface LoggerOptions {
  serviceName: string;
  logLevel?: LogLevel;
  isProduction: boolean;
  metadata?: Record<string, unknown>;
  additionalFormats?: Format[];
  additionalDevelopmentFormats?: Format[];
}

export interface ILogger {
  debug: (message: string, params?: Record<string, unknown>) => void;
  info: (message: string, params?: Record<string, unknown>) => void;
  warn: (message: string, params?: Record<string, unknown>) => void;
  error: (
    message: string,
    params?: Record<string, unknown>,
    err?: Error
  ) => void;
  child: (metadata?: Pick<LoggerOptions, "metadata">) => ILogger;
}
