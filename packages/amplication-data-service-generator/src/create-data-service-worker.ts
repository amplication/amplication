import { parentPort } from "worker_threads";
import { createDataServiceImpl } from "./create-data-service-impl";

import { WorkerParam, WorkerResult } from "./types";
import { createWorkerLogger } from "./util/worker-logging";

parentPort?.once("message", (params: WorkerParam) => {
  const { entities, roles, appInfo } = params;

  const loggerCallback = (message: string) => {
    const messageData: WorkerResult = {
      message,
      done: false,
    };
    parentPort?.postMessage(messageData);
  };

  const logger = createWorkerLogger(loggerCallback);

  createDataServiceImpl(entities, roles, appInfo, logger)
    .then((modules) => {
      const results: WorkerResult = {
        done: true,
        modules,
      };
      parentPort?.postMessage(results);
      parentPort?.close();
    })
    .catch((error) => {
      const results: WorkerResult = {
        error: error,
        done: false,
      };

      parentPort?.postMessage(results);
      parentPort?.close();
    });
});
