export enum EnumTokenType {
  User = 'User',
  ApiToken = 'ApiToken'
}

export interface JwtDto {
  accountId: string;
  userId?: string | null;
  workspaceId?: string | null;
  roles?: string[] | null;
  type?: EnumTokenType;
  tokenId?: string;
}
