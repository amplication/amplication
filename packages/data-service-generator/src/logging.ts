import { Logger, LogLevel } from "@amplication/util/logging";

const { LOG_LEVEL, NODE_ENV } = process.env;

export const logger = new Logger({
  isProduction: NODE_ENV !== "Development",
  serviceName: "data-service-generator",
  logLevel: LogLevel[LOG_LEVEL],
});
