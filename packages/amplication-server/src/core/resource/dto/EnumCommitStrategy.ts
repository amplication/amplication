import { registerEnumType } from "@nestjs/graphql";

export enum EnumCommitStrategy {
  All = "all",
  AllWithPendingChanges = "allWithPendingChanges",
  Specific = "specific",
}

registerEnumType(EnumCommitStrategy, {
  name: "EnumCommitStrategy",
});
