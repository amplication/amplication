import { EnumGitPullEventStatus } from "../enums/gitPullEventStatus";

export interface IGitPullEvent {
  id: bigint;
  provider: string;
  repositoryOwner: string;
  repositoryName: string;
  branch: string;
  commit: string;
  status: keyof typeof EnumGitPullEventStatus;
  pushedAt: Date;
}
