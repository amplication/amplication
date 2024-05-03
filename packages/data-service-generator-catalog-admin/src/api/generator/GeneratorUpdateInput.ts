import { VersionUpdateManyWithoutGeneratorsInput } from "./VersionUpdateManyWithoutGeneratorsInput";

export type GeneratorUpdateInput = {
  fullName?: string | null;
  name?: string | null;
  version?: VersionUpdateManyWithoutGeneratorsInput;
};
