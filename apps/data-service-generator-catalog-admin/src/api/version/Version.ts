export type Version = {
  createdAt: Date;
  deletedAt: Date | null;
  deprecated: boolean | null;
  description: string | null;
  id: string;
  name: string | null;
  updatedAt: Date;
};
