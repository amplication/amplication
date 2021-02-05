import winston from "winston";

import { defaultLogger } from "./server/logging";
import { Entity, Role, AppInfo, Module, WorkerResult } from "./types";
import { createDataServiceImpl } from "./create-data-service-impl";
import { Worker } from "worker_threads";
import path from "path";

export async function createDataService(
  entities: Entity[],
  roles: Role[],
  appInfo: AppInfo,
  logger: winston.Logger = defaultLogger,
  useWorker = true
): Promise<Module[]> {
  if (useWorker) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        path.resolve(__dirname, "./create-data-service-worker.js")
      );

      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
      worker.on("message", (data: WorkerResult) => {
        if (data.message) {
          logger.info(data.message);
        }
        if (data.error) {
          reject(data.error);
        }
        if (data.done && data.modules) {
          resolve(data.modules);
        }
      });
      worker.postMessage({
        entities,
        roles,
        appInfo,
      });
    });
  } else {
    console.warn(
      "Creating data service without a worker. It is recommended to always use useWorker=true "
    );
    return await createDataServiceImpl(entities, roles, appInfo, logger);
  }
}
