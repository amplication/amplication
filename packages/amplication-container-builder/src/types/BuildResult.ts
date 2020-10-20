export enum EnumBuildStatus {
  Running = "Running",
  Completed = "Completed",
  Failed = "Failed",
}

export type BuildResult = {
  images?: string[];
  statusQuery?: object;
  status: EnumBuildStatus;
};
