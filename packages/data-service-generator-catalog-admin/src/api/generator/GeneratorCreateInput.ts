import { VersionCreateNestedManyWithoutGeneratorsInput } from "./VersionCreateNestedManyWithoutGeneratorsInput";

export type GeneratorCreateInput = {
  name?: string | null;
  fullName?: string | null;
  version?: VersionCreateNestedManyWithoutGeneratorsInput;
  isActive?: boolean | null;
};
