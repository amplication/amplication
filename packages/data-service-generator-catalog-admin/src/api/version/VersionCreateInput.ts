export type VersionCreateInput = {
  changelog?: string | null;
  deletedAt?: Date | null;
  isActive: boolean;
  isDeprecated?: boolean | null;
  name?: string | null;
};
