export interface IDatabaseOperations {
  create: (eventData: IGitPullEvent) => Promise<IGitPullEvent>;
  update: (
    id: number,
    status: EnumGitPullEventStatus
  ) => Promise<IGitPullEvent>;
}

export interface IGitPullEvent {
  provider: string;
  repositoryOwner: string;
  repositoryName: string;
  branch: string;
  commit: string;
  status: EnumGitPullEventStatus;
  pushedAt: string;
  id?: number;
  createdAt?: string;
  updatedAt?: string;
}

export enum EnumGitPullEventStatus {
  Created = "Created",
  Ready = "Ready",
  Deleted = "Deleted",
}
