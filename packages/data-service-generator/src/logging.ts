import { Logger, LogLevel } from "@amplication/util/logging";

export const logger = new Logger({
  isProduction: true,
  serviceName: "data-service-generator",
  logLevel: LogLevel[process.env.LOG_LEVEL],
});
