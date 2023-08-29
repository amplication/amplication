import { SortOrder } from "../../util/SortOrder";

export type VersionOrderByInput = {
  createdAt?: SortOrder;
  deletedAt?: SortOrder;
  deprecated?: SortOrder;
  description?: SortOrder;
  id?: SortOrder;
  name?: SortOrder;
  updatedAt?: SortOrder;
};
