import { RolesPermissions } from "@amplication/util-roles-types";

export enum EnumTokenType {
  User = "User",
  ApiToken = "ApiToken",
}

export interface JwtDto {
  accountId: string;
  userId?: string | null;
  workspaceId?: string | null;
  roles?: string[] | null;
  permissions: RolesPermissions[];
  type?: EnumTokenType;
  tokenId?: string;
}
