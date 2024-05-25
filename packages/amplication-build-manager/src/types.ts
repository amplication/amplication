export enum EnumDomainName {
  Server = "server",
  AdminUI = "admin-ui",
}

export enum EnumJobStatus {
  InProgress = "in-progress",
  Success = "success",
  Failure = "failure",
}

export type JobBuildId<T extends BuildId> = `${T}-${EnumDomainName}` | T;
export type BuildId = string;
export type RedisValue = Record<JobBuildId<BuildId>, EnumJobStatus>;

export type CodeGenerationRequest = {
  resourceId: string;
  buildId: string;
  codeGeneratorVersion: string;
  codeGeneratorName: string;
};
