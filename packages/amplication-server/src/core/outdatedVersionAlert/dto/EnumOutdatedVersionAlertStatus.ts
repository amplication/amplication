import { registerEnumType } from "@nestjs/graphql";

export enum EnumOutdatedVersionAlertStatus {
  New = "New",
  Resolved = "Resolved",
  Ignored = "Ignored",
}

registerEnumType(EnumOutdatedVersionAlertStatus, {
  name: "EnumOutdatedVersionAlertStatus",
});
