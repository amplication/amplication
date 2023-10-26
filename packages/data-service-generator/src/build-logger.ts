import { BuildLogger as IBuildLogger } from "@amplication/code-gen-types";
import { LogEntry, LogLevel } from "@amplication/util/logging";
import { logger as applicationLogger } from "./logging";
import { httpClient } from "./utils/http-client";

export class BuildLogger implements IBuildLogger {
  private async createLog(log: LogEntry): Promise<void> {
    try {
      const logContext = { buildId: process.env.BUILD_ID, ...log };
      if (process.env.REMOTE_ENV !== "true") {
        applicationLogger.info(
          "Running locally, skipping log reporting",
          logContext
        );
        return;
      }
      await httpClient.post(
        new URL("build-logger/create-log", process.env.BUILD_MANAGER_URL).href,
        logContext
      );
    } catch (error) {
      applicationLogger.error("Failed to send log to build manager", error);
    }
  }

  private async logToBuildLog(level: LogLevel, message: string): Promise<void> {
    await this.createLog({
      level,
      message,
    });
  }

  async info(
    message: string,
    params?: Record<string, unknown>,
    userFriendlyMessage?: string
  ): Promise<void> {
    userFriendlyMessage = userFriendlyMessage || message;
    applicationLogger.info(message, params);
    await this.logToBuildLog(LogLevel.Info, userFriendlyMessage);
  }

  async warn(
    message: string,
    params?: Record<string, unknown>,
    userFriendlyMessage?: string
  ): Promise<void> {
    userFriendlyMessage = userFriendlyMessage || message;
    applicationLogger.warn(message, params);
    await this.logToBuildLog(LogLevel.Warn, userFriendlyMessage);
  }

  async error(
    message: string,
    params?: Record<string, unknown>,
    userFriendlyMessage?: string,
    error?: Error
  ): Promise<void> {
    userFriendlyMessage = userFriendlyMessage || message;
    applicationLogger.error(message, error, params);
    await this.logToBuildLog(LogLevel.Error, userFriendlyMessage);
  }
}
