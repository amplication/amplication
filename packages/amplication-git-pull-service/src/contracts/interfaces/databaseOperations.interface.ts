import { EnumGitPullEventStatus } from "../enums/gitPullEventStatus";
import { EventData } from "./eventData";

export interface IDatabaseOperations {
  create: (eventData: EventData) => Promise<EventData>;
  update: (id: bigint, status: EnumGitPullEventStatus) => Promise<EventData>;
  getPreviousReadyCommit: (
    eventData: EventData,
    skip: number,
    timestamp: Date
  ) => Promise<EventData | undefined>;
}
