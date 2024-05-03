import { VersionCreateNestedManyWithoutGeneratorsInput } from "./VersionCreateNestedManyWithoutGeneratorsInput";

export type GeneratorCreateInput = {
  fullName?: string | null;
  isActive?: boolean | null;
  name?: string | null;
  version?: VersionCreateNestedManyWithoutGeneratorsInput;
};
