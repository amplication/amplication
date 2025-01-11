import { GeneratorWhereUniqueInput } from "../generator/GeneratorWhereUniqueInput";

export type VersionUpdateInput = {
  changelog?: string | null;
  deletedAt?: Date | null;
  generator?: GeneratorWhereUniqueInput | null;
  isActive?: boolean;
  isDeprecated?: boolean | null;
  name?: string;
};
