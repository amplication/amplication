import { registerEnumType } from "@nestjs/graphql";

export enum EnumRole {
  Admin = "ADMIN",
  User = "USER",
  OrganizationAdmin = "ORGANIZATION_ADMIN",
  ProjectAdmin = "PROJECT_ADMIN",
}
registerEnumType(EnumRole, {
  name: "EnumRole",
});
