import { registerEnumType } from "@nestjs/graphql";

export enum EnumGitOrganizationType {
  User = "User",
  Organization = "Organization",
}

registerEnumType(EnumGitOrganizationType, {
  name: "EnumGitOrganizationType",
});
