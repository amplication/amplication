// enums
export enum GitFetchTypeEnum {
  Clone = "clone",
  Pull = "pull",
}

export enum GitProviderEnum {
  Github = "Github",
}

export enum GitPullEventStatusEnum {
  Created = "Created",
  Ready = "Ready",
  Deleted = "Deleted",
}

// interfaces
export interface EventData {
  id: bigint;
  provider: keyof typeof GitProviderEnum;
  repositoryOwner: string;
  repositoryName: string;
  branch: string;
  commit: string;
  status: keyof typeof GitPullEventStatusEnum;
  pushedAt: Date;
}

export interface PushEventMessage extends EventData {
  installationId: string;
}

export interface GitClient {
  clone: (
    pushEventMessage: PushEventMessage,
    baseDir: string,
    accessToken: string
  ) => Promise<void>;
  pull: (
    pushEventMessage: PushEventMessage,
    baseDir: string,
    accessToken: string
  ) => Promise<void>;
}

export interface GitHostProviderFactory {
  getHostProvider: (provider: GitProviderEnum) => GitProvider;
}
export interface GitProvider {
  createInstallationAccessToken: (installationId: string) => Promise<string>;
}
export interface GitPullEvent {
  handlePushEvent: (pushEventMessage: PushEventMessage) => Promise<void>;
}
export interface GitPullEventRepository {
  create: (eventData: EventData) => Promise<{ id: bigint }>;
  update: (id: bigint, status: GitPullEventStatusEnum) => Promise<boolean>;
  findByPreviousReadyCommit: (
    provider: keyof typeof GitProviderEnum,
    repositoryOwner: string,
    repositoryName: string,
    branch: string,
    pushedAt: Date,
    skip: number
  ) => Promise<EventData | undefined>;
}
export interface Storage {
  copyDir: (srcDir: string, destDir: string) => Promise<void>;
  deleteDir: (dir: string) => void;
}
