import { Version } from "../version/Version";

export type Generator = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string | null;
  fullName: string | null;
  version?: Array<Version>;
  isActive: boolean | null;
};
