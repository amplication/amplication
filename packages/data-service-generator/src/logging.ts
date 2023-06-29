import { Logger, LogLevel } from "@amplication/util/logging";

const { LOG_LEVEL, NODE_ENV } = process.env;

export const logger = new Logger({
  isProduction: NODE_ENV !== "Development",
  component: "data-service-generator",
  logLevel: LogLevel[LOG_LEVEL],
  metadata: {
    resourceId: process.env.RESOURCE_ID,
    buildId: process.env.BUILD_ID,
  },
});
