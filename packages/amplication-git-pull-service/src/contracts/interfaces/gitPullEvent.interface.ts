import { EventData } from "./eventData";

export interface IGitPullEvent {
  pushEventHandler: (
    eventData: EventData,
    installationId: string,
    skip: number
  ) => Promise<void>;
}
