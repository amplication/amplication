import { VersionUpdateManyWithoutGeneratorsInput } from "./VersionUpdateManyWithoutGeneratorsInput";

export type GeneratorUpdateInput = {
  name?: string | null;
  fullName?: string | null;
  version?: VersionUpdateManyWithoutGeneratorsInput;
  isActive?: boolean | null;
};
