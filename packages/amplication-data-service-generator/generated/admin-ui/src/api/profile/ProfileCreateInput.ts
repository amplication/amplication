import { UserWhereUniqueInput } from "../user/UserWhereUniqueInput";

export type ProfileCreateInput = {
  email: string;
  user?: UserWhereUniqueInput | null;
};
