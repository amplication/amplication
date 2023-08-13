import { Format } from "logform";

export enum LogLevel {
  Debug = "debug",
  Info = "info",
  Warn = "warn",
  Error = "error",
}

export interface LoggerOptions {
  component: string;
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
    err?: Error,
    params?: Record<string, unknown>
  ) => void;
  child: (metadata?: Pick<LoggerOptions, "metadata">) => ILogger;
}

export interface LogEntry {
  level: string;
  message: string;
  [optionName: string]: unknown;
}
