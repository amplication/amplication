import { GitProviderEnum, EnumGitPullEventStatus } from "../enums";
import { EventData } from "./event-data";

export interface GitPullEventRepository {
  create: (eventData: EventData) => Promise<{ id: bigint }>;
  update: (id: bigint, status: EnumGitPullEventStatus) => Promise<boolean>;
  findByPreviousReadyCommit: (
    provider: keyof typeof GitProviderEnum,
    repositoryOwner: string,
    repositoryName: string,
    branch: string,
    pushedAt: Date,
    skip: number
  ) => Promise<EventData | undefined>;
}
