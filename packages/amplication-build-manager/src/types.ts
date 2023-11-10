export enum EnumDomainName {
  Server = "server",
  AdminUI = "admin-ui",
}

export enum EnumJobStatus {
  InProgress = "in-progress",
  Success = "success",
  Failure = "failure",
}

export type JobBuildId<T extends string> = `${T}-${EnumDomainName}`;
export type BuildId = string;
export type RedisValue = Record<JobBuildId<BuildId>, EnumJobStatus>;
