export interface JwtDto {
  accountId: string;
  userId?: string | null;
  organizationId?: string | null;
  roles?: string[] | null;
}
