import { GeneratorWhereUniqueInput } from "../generator/GeneratorWhereUniqueInput";

export type VersionCreateInput = {
  name: string;
  changelog?: string | null;
  isDeprecated?: boolean | null;
  deletedAt?: Date | null;
  isActive: boolean;
  generator?: GeneratorWhereUniqueInput | null;
};
