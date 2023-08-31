export type Version = {
  changelog: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  deprecated: boolean | null;
  id: string;
  name: string | null;
  updatedAt: Date;
};
