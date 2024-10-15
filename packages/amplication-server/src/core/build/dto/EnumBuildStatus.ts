import { registerEnumType } from "@nestjs/graphql";

export enum EnumBuildStatus {
  Running = "Running",
  Completed = "Completed",
  Failed = "Failed",
  Invalid = "Invalid",
  Unknown = "Unknown",
  Canceled = "Canceled",
}

registerEnumType(EnumBuildStatus, {
  name: "EnumBuildStatus",
});
