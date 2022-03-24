import { GitPullEventRepository } from "../database/gitPullEvent.repository";

export interface IGitPullEvent {
  create: (entity: GitPullEvent) => GitPullEvent;
  update: (status: EnumGitRepositoryPullStatus) => GitPullEvent;
  remove: (id: number) => GitPullEvent;
}

export interface GitPullEvent {
  id: number;
  createdAt: string;
  updatedAt: string
  pushedAt: string
  provider: string;
  owner: string;
  branch: string;
  status:EnumGitRepositoryPullStatus;
  name: string;
}

export enum EnumGitRepositoryPullStatus {
  Created = 'Created',
  Ready = 'Ready',
  Deleted = 'Deleted',
}