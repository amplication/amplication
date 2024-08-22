import { registerEnumType } from "@nestjs/graphql";

export enum EnumPackageStatus {
  Initial = "Initial",
  Completed = "Completed",
  Failed = "Failed",
}

registerEnumType(EnumPackageStatus, { name: "EnumPackageStatus" });
