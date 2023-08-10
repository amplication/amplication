import { ModelWhereUniqueInput } from "./ModelWhereUniqueInput";
import { ModelUpdateInput } from "./ModelUpdateInput";

export type UpdateModelArgs = {
  where: ModelWhereUniqueInput;
  data: ModelUpdateInput;
};
