export enum EnumDomainName {
  Server = "server",
  AdminUI = "admin-ui",
}

export enum EnumEventStatus {
  InProgress = "in-progress",
  Success = "success",
  Failure = "failure",
}

export type BuildIdWithDomainName<T extends string> = `${T}-${EnumDomainName}`;
export type BuildId = string;
export type RedisValue = Record<
  BuildIdWithDomainName<BuildId>,
  EnumEventStatus
>;
