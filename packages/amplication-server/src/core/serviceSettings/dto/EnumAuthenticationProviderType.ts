import { registerEnumType } from "@nestjs/graphql";

export enum EnumAuthProviderType {
  Http = "Http",
  Jwt = "Jwt",
  Auth0 = "Auth0",
}

registerEnumType(EnumAuthProviderType, {
  name: "EnumAuthProviderType",
});
