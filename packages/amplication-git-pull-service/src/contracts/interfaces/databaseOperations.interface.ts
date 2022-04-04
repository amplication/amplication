import { EnumGitPullEventStatus } from "../enums/gitPullEventStatus";
import { EventData } from "./eventData";

export interface IDatabaseOperations {
  create: (
    provider: string,
    repositoryOwner: string,
    repositoryName: string,
    branch: string,
    commit: string,
    status: keyof typeof EnumGitPullEventStatus,
    pushedAt: Date
  ) => Promise<EventData>;
  update: (id: bigint, status: EnumGitPullEventStatus) => Promise<EventData>;
  getPreviousReadyCommit: (
    eventData: Partial<EventData>,
    skip: number,
    timestamp: Date
  ) => Promise<EventData | undefined>;
}
