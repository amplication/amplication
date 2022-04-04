import { EnumGitPullEventStatus } from "../enums/gitPullEventStatus.enum";
import { EventData } from "./eventData";
import { GitProviderEnum } from "../enums/gitProvider.enum";

export interface IDatabaseOperations {
  create: (
    provider: keyof typeof GitProviderEnum,
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
