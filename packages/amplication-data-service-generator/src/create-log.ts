import axios from "axios";
import { LogEntry } from "winston";

export const createLog = async (log: LogEntry): Promise<void> => {
  if (process.env.REMOTE_ENV !== "true") {
    console.log("Running locally, skipping log reporting");
    return;
  }

  console.log("Sending log to build manager");
  await axios.post(
    new URL("build-logger/create-log", process.env.BUILD_MANAGER_URL).href,
    {
      buildId: process.env.BUILD_ID,
      ...log,
    }
  );
};
