import { UserWhereUniqueInput } from "../user/UserWhereUniqueInput";

export type ProfileUpdateInput = {
  email?: string;
  user?: UserWhereUniqueInput | null;
};
