import { WinstonModuleOptions } from "nest-winston";
import { format as winstonFormat, transports } from "winston";
import { format as winstonCloudLoggingFormat } from "winston-cloud-logging";
import assert from "assert";

export const LEVEL = "info";

export const developmentFormat = winstonFormat.combine(
  winstonFormat.errors({ stack: true }),
  winstonFormat.timestamp(),
  winstonFormat.colorize(),
  winstonFormat.simple()
);

export const productionFormat = winstonFormat.combine(
  winstonFormat.errors({ stack: true }),
  winstonFormat.timestamp(),
  winstonCloudLoggingFormat(),
  winstonFormat.json()
);

export const winstonConfigFactory = (
  isProduction: boolean
): WinstonModuleOptions => {
  assert(
    typeof isProduction === "boolean",
    "Missing isProduction variable in the winstonConfigFactory"
  );

  return {
    level: LEVEL,
    format: isProduction ? productionFormat : developmentFormat,
    transports: [new transports.Console()],
  };
};
