// #region enums

export enum KafkaTopics {
  GitExternalPush = "git.external.push.event.0",
}

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

export enum ErrorMessages {
  AccessTokenError = "failed to create new access token",
  CreateNewRecordError = "failed to create a new record in DB",
  UpdateRecordError = "failed to update a record in DB",
  PreviousReadyCommitNotFound = "failed to find previous ready commit in DB",
  RepositoryCloneFailure = "failed to clone a repository",
  RepositoryPullFailure = "failed to pull a repository",
  CopyDirFailure = "failed to copy files from srcDir to destDir",
  CleanDirFailure = "failed to remove non-code files from srcDir",
  GitHostProviderError = "Invalid source control service",
}

// #endregion

// #region interfaces

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

export interface GitProvider {
  createInstallationAccessToken: (installationId: string) => Promise<string>;
}
// #endregion
