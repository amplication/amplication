import { User } from "../user/User";

export type Profile = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  user?: User | null;
};
