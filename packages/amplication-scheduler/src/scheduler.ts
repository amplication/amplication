import { CronJob } from "cron";
import fetch from "node-fetch";
import { Config } from "./config"; // getting after npm run build:generate-types from config.schema.json

export function createJob(config: Config): CronJob {
  return new CronJob(
    config.schedule,
    () =>
      fetch(config.request.url, config.request)
        .then((res) => {
          const { method = "GET" } = config.request;
          const log = `${method} ${config.request.url} - ${res.status}`;
          console.info(log);
        })
        .catch((error) => {
          console.error(error.message);
        }),
    null,
    true,
    config.timezone
  );
}
