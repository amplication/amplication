export interface IGitPullEvent {
  id: bigint;
  provider: string;
  repositoryOwner: string;
  repositoryName: string;
  branch: string;
  commit: string;
  status: string;
  pushedAt: Date;
}
