import { EnumGitPullEventStatus } from "../enums/gitPullEventStatus";
import { IGitPullEvent } from "./gitPullEvent.interface";

export interface IDatabaseOperations {
  create: (eventData: any) => Promise<IGitPullEvent>;
  update: (id: bigint, status: EnumGitPullEventStatus) => Promise<IGitPullEvent>;
  getPrevXReadyCommit: (
    eventData: IGitPullEvent,
    skip: number,
    timestamp: Date
  ) => Promise<IGitPullEvent | null>;
}
