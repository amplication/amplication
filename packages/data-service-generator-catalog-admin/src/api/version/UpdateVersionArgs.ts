import { VersionWhereUniqueInput } from "./VersionWhereUniqueInput";
import { VersionUpdateInput } from "./VersionUpdateInput";

export type UpdateVersionArgs = {
  where: VersionWhereUniqueInput;
  data: VersionUpdateInput;
};
