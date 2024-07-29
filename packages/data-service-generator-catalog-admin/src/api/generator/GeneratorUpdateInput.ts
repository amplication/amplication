import { VersionUpdateManyWithoutGeneratorsInput } from "./VersionUpdateManyWithoutGeneratorsInput";

export type GeneratorUpdateInput = {
  fullName?: string | null;
  isActive?: boolean | null;
  name?: string | null;
  version?: VersionUpdateManyWithoutGeneratorsInput;
};
