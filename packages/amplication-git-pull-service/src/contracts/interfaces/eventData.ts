import { EnumGitPullEventStatus } from "../enums/gitPullEventStatus";

export class EventData {
  id: bigint;
  provider: string;
  repositoryOwner: string;
  repositoryName: string;
  branch: string;
  commit: string;
  status: keyof typeof EnumGitPullEventStatus;
  pushedAt: Date;

  constructor(
    id: bigint,
    provider: string,
    repositoryOwner: string,
    repositoryName: string,
    branch: string,
    commit: string,
    status: keyof typeof EnumGitPullEventStatus,
    pushedAt: Date,
  ) {
      this.id = id;
      this.provider = provider;
      this.repositoryOwner = repositoryOwner;
      this.repositoryName = repositoryName;
      this.branch = branch;
      this.commit = commit;
      this.status = status;
      this.pushedAt = pushedAt;

  }
}
