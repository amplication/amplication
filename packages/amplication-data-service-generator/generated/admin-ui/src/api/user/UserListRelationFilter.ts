import { UserWhereInput } from "./UserWhereInput";

export type UserListRelationFilter = {
  every?: UserWhereInput;
  some?: UserWhereInput;
  none?: UserWhereInput;
};
