import { ModelWhereInput } from "./ModelWhereInput";

export type ModelListRelationFilter = {
  every?: ModelWhereInput;
  some?: ModelWhereInput;
  none?: ModelWhereInput;
};
