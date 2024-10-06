import { registerEnumType } from "@nestjs/graphql";

export enum EnumBuildGitStatus {
  NotConnected = "NotConnected",
  Waiting = "Waiting",
  Completed = "Completed",
  Failed = "Failed",
  Canceled = "Canceled",
  Unknown = "Unknown",
}

registerEnumType(EnumBuildGitStatus, {
  name: "EnumBuildGitStatus",
});
