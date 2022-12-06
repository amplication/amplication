import { httpClient } from "./util/httpClient";
import { defaultLogger as logger } from "./server/logging";
import { LogEntry } from "winston";

export const createLog = async (log: LogEntry): Promise<void> => {
  try {
    if (process.env.REMOTE_ENV !== "true") {
      logger.info("Running locally, skipping log reporting");
      return;
    }

    logger.info("Sending log to build manager");
    await httpClient.post(
      new URL("build-logger/create-log", process.env.BUILD_MANAGER_URL).href,
      {
        buildId: process.env.BUILD_ID,
        ...log,
      }
    );
  } catch (error) {
    logger.error("Failed to send log to build manager", error);
  }
};
