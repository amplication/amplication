import { Generator } from "../generator/Generator";

export type Version = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  changelog: string | null;
  isDeprecated: boolean | null;
  deletedAt: Date | null;
  isActive: boolean;
  generator?: Generator | null;
};
