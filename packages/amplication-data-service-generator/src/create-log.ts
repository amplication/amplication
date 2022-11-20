import axios from "axios";
import { LogEntry } from "winston";

export const createLog = async (log: LogEntry): Promise<void> => {
  await axios.post(
    new URL("build-logger/create-log", process.env.BUILD_MANAGER_URL).href,
    {
      buildId: process.env.BUILD_ID,
      ...log,
    }
  );
};
