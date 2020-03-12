export interface JwtDto {
  userId?: string;
  accountId: string;
  organizationId?: string;
  roles?: string[];
}
