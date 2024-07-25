import { SortOrder } from "../../util/SortOrder";

export type GeneratorOrderByInput = {
  id?: SortOrder;
  createdAt?: SortOrder;
  updatedAt?: SortOrder;
  name?: SortOrder;
  fullName?: SortOrder;
  isActive?: SortOrder;
};
