import { UserWhereUniqueInput } from "./UserWhereUniqueInput";
import { UserUpdateInput } from "./UserUpdateInput";

export type UpdateUserArgs = {
  where: UserWhereUniqueInput;
  data: UserUpdateInput;
};
