import { GeneratorWhereInput } from "./GeneratorWhereInput";
import { GeneratorOrderByInput } from "./GeneratorOrderByInput";

export type GeneratorFindManyArgs = {
  where?: GeneratorWhereInput;
  orderBy?: Array<GeneratorOrderByInput>;
  skip?: number;
  take?: number;
};
