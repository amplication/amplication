import { registerEnumType } from "@nestjs/graphql";

export enum PreviewAccountType {
  None = "None",
  BreakingTheMonolith = "BreakingTheMonolith",
  Auth0Signup = "Auth0Signup",
}

registerEnumType(PreviewAccountType, {
  name: "PreviewAccountType",
});
