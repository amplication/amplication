import { registerEnumType } from "@nestjs/graphql";

export enum EnumPreviewAccountType {
  None = "None",
  BreakingTheMonolith = "BreakingTheMonolith",
  Auth0Signup = "Auth0Signup",
}

registerEnumType(EnumPreviewAccountType, {
  name: "EnumPreviewAccountType",
});
