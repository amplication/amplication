export interface IDatabaseActions {
  create: (eventData: IGitPullEvent) => Promise<IGitPullEvent>;
  update: (
    id: number,
    status: EnumGitPullEventStatus
  ) => Promise<IGitPullEvent>;
  remove: (id: number) => Promise<IGitPullEvent>;
}

export interface IGitPullEvent {
  id: number;
  provider: string;
  repositoryOwner: string;
  repositoryName: string;
  branch: string;
  commit: string;
  status: EnumGitPullEventStatus;
  pushedAt: string;
  createdAt: string;
  updatedAt: string;
}

export enum EnumGitPullEventStatus {
  Created = "Created",
  Ready = "Ready",
  Deleted = "Deleted",
}
