import { GeneratorWhereUniqueInput } from "../generator/GeneratorWhereUniqueInput";

export type VersionUpdateInput = {
  name?: string;
  changelog?: string | null;
  isDeprecated?: boolean | null;
  deletedAt?: Date | null;
  isActive?: boolean;
  generator?: GeneratorWhereUniqueInput | null;
};
