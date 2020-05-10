import { registerEnumType } from "@nestjs/graphql";

export enum EnumRoleLevel {
  Organization = "Organization",
  Project = "Project"
}
registerEnumType(EnumRoleLevel, {
  name: "EnumRoleLevel",
  description: undefined,
});
