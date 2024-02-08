import { registerEnumType } from "@nestjs/graphql";

export enum EnumPreviewAccountType {
  None = "None",
  BreakingTheMonolith = "BreakingTheMonolith",
}

registerEnumType(EnumPreviewAccountType, {
  name: "EnumPreviewAccountType",
});
