import { ModelWhereInput } from "./ModelWhereInput";
import { ModelOrderByInput } from "./ModelOrderByInput";

export type ModelFindManyArgs = {
  where?: ModelWhereInput;
  orderBy?: Array<ModelOrderByInput>;
  skip?: number;
  take?: number;
};
