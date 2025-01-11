import { registerEnumType } from "@nestjs/graphql";

export enum EnumOutdatedVersionAlertStatus {
  New = "New",
  Resolved = "Resolved",
  Ignored = "Ignored",
  Canceled = "Canceled",
}

registerEnumType(EnumOutdatedVersionAlertStatus, {
  name: "EnumOutdatedVersionAlertStatus",
});
