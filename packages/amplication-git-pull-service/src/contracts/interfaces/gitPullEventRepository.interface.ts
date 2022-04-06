import { EnumGitPullEventStatus } from "../enums/gitPullEventStatus";
import { EventData } from "./eventData";

export interface IGitPullEventRepository {
  create: (eventData: EventData) => Promise<{ id: bigint }>;
  update: (id: bigint, status: EnumGitPullEventStatus) => Promise<boolean>;
  findByPreviousReadyCommit: (
    provider: string,
    repositoryOwner: string,
    repositoryName: string,
    branch: string,
    pushedAt: Date,
    skip: number,
    timestamp: Date
  ) => Promise<EventData | undefined>;
}
