import { VersionCreateNestedManyWithoutGeneratorsInput } from "./VersionCreateNestedManyWithoutGeneratorsInput";

export type GeneratorCreateInput = {
  fullName?: string | null;
  name?: string | null;
  version?: VersionCreateNestedManyWithoutGeneratorsInput;
};
