import { EnumGitPullEventStatus } from "../enums/gitPullEventStatus";

export interface IGitPullEvent {
  id: BigInt;
  provider: string;
  repositoryOwner: string;
  repositoryName: string;
  branch: string;
  commit: string;
  status: EnumGitPullEventStatus;
  pushedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
