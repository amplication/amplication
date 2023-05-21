import { httpClient } from "./utils/http-client";
import { logger } from "./logging";

interface BuildManagerNotifierOptions {
  buildManagerUrl: string;
  resourceId: string;
  buildId: string;
}

export class BuildManagerNotifier {
  constructor(private readonly options: BuildManagerNotifierOptions) {}
  async success(): Promise<void> {
    if (process.env.REMOTE_ENV !== "true") {
      logger.info("Running locally, skipping log reporting");
      return;
    }

    await httpClient.post(
      new URL(
        "build-runner/code-generation-success",
        this.options.buildManagerUrl
      ).href,
      {
        resourceId: this.options.resourceId,
        buildId: this.options.buildId,
      }
    );
  }

  async failure(): Promise<void> {
    if (process.env.REMOTE_ENV !== "true") {
      logger.info("Running locally, skipping log reporting");
      return;
    }

    await httpClient.post(
      new URL(
        "build-runner/code-generation-failure",
        this.options.buildManagerUrl
      ).href,
      {
        resourceId: this.options.resourceId,
        buildId: this.options.buildId,
      }
    );
  }
}
