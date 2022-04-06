import { EventData } from "./eventData";

export interface IGitClient {
  clone: (
    eventData: EventData,
    baseDir: string,
    installationId: string,
    accessToken: string
  ) => Promise<void>;
  pull: (branch: string, commit: string, baseDir: string) => Promise<void>;
}
