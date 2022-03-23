export interface IDatabase {
  create: (entity: GitRepositoryPull) => GitRepositoryPull;
  update: (entity: GitRepositoryPull) => GitRepositoryPull;
  remove: (id: number) => GitRepositoryPull;
}

export interface GitRepositoryPull {
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

enum EnumGitRepositoryPullStatus {
  Created = 'Created',
  Ready = 'Ready',
  Deleted = 'Deleted',
}