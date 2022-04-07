import { EventData } from "./eventData";
import { EnumGitPullEventStatus } from "../enums/gitPullEventStatus.enum";
import { GitProviderEnum } from "../enums/gitProvider.enum";

export interface IGitPullEventRepository {
  create: (eventData: EventData) => Promise<{ id: bigint }>;
  update: (id: bigint, status: EnumGitPullEventStatus) => Promise<boolean>;
  findByPreviousReadyCommit: (
    provider: keyof typeof GitProviderEnum,
    repositoryOwner: string,
    repositoryName: string,
    branch: string,
    pushedAt: Date,
    skip: number,
    timestamp: Date
  ) => Promise<EventData | undefined>;
}
