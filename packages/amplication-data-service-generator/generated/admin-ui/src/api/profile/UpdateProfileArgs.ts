import { ProfileWhereUniqueInput } from "./ProfileWhereUniqueInput";
import { ProfileUpdateInput } from "./ProfileUpdateInput";

export type UpdateProfileArgs = {
  where: ProfileWhereUniqueInput;
  data: ProfileUpdateInput;
};
