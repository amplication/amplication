import { Generator } from "../generator/Generator";

export type Version = {
  changelog: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  generator?: Generator | null;
  id: string;
  isActive: boolean;
  isDeprecated: boolean | null;
  name: string;
  updatedAt: Date;
};
