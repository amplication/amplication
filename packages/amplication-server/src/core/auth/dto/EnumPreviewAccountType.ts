import { registerEnumType } from "@nestjs/graphql";

export enum PreviewAccountType {
  None = "None",
  BreakingTheMonolith = "BreakingTheMonolith",
}

registerEnumType(PreviewAccountType, {
  name: "PreviewAccountType",
});
