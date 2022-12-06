import { httpClient } from "./util/httpClient";
import { defaultLogger as logger } from "./server/logging";
import { LogEntry } from "winston";

export const createLog = async (log: LogEntry): Promise<void> => {
  try {
    const logContext = { buildId: process.env.BUILD_ID, ...log };
    if (process.env.REMOTE_ENV !== "true") {
      logger.info("Running locally, skipping log reporting", logContext);
      return;
    }

    await httpClient.post(
      new URL("build-logger/create-log", process.env.BUILD_MANAGER_URL).href,
      logContext
    );
  } catch (error) {
    logger.error("Failed to send log to build manager", error);
  }
};
