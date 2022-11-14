import { registerEnumType } from "@nestjs/graphql";

export enum EnumWorkspaceMemberType {
  User = "User",
  Invitation = "Invitation",
}

registerEnumType(EnumWorkspaceMemberType, {
  name: "EnumWorkspaceMemberType",
});
