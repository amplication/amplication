import { EnumGitPullEventStatus } from "../enums/gitPullEventStatus";

export interface IGitPullEvent {
  fetchRepository: (
    provider: string,
    repositoryOwner: string,
    repositoryName: string,
    branch: string,
    commit: string,
    status: keyof typeof EnumGitPullEventStatus,
    pushedAt: Date,
    baseDir: string,
    remote: string,
    installationId: string,
    skip: number
  ) => void;
}
