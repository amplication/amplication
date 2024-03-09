import { registerEnumType } from "@nestjs/graphql";

export enum EnumPreviewAccountType {
  None = "None",
  BreakingTheMonolith = "BreakingTheMonolith",
  PreviewOnboarding = "PreviewOnboarding",
}

registerEnumType(EnumPreviewAccountType, {
  name: "EnumPreviewAccountType",
});
