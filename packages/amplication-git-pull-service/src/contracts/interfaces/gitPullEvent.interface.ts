import { EventData } from "./eventData";

export interface IGitPullEvent {
  pushEventHandler: (
    eventData: EventData,
    baseDir: string,
    remote: string,
    installationId: string,
    skip: number
  ) => Promise<void>;
}
