import assert from "assert";
import { format as logformFormat } from "logform";
import { WinstonModuleOptions } from "nest-winston";
import { transports } from "winston";
import { format as winstonCloudLoggingFormat } from "winston-cloud-logging";

export const LEVEL = process.env.AMPLICATION_LOG_LEVEL || "info";

export type defaultMeta = { service: string };

export const developmentFormat = logformFormat.combine(
  logformFormat.errors({ stack: true }),
  logformFormat.timestamp(),
  logformFormat.colorize(),
  logformFormat.simple()
);

export const productionFormat = logformFormat.combine(
  logformFormat.errors({ stack: true }),
  logformFormat.timestamp(),
  winstonCloudLoggingFormat(),
  logformFormat.json()
);

export const winstonConfigFactory = (
  isProduction: boolean,
  defaultMeta: defaultMeta
): WinstonModuleOptions => {
  assert(
    typeof isProduction === "boolean",
    "Missing isProduction argument in the winstonConfigFactory"
  );

  return {
    defaultMeta,
    level: LEVEL,
    format: isProduction ? productionFormat : developmentFormat,
    transports: [new transports.Console()],
  };
};
