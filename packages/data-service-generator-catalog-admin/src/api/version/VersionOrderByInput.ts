import { SortOrder } from "../../util/SortOrder";

export type VersionOrderByInput = {
  changelog?: SortOrder;
  createdAt?: SortOrder;
  deletedAt?: SortOrder;
  deprecated?: SortOrder;
  id?: SortOrder;
  name?: SortOrder;
  updatedAt?: SortOrder;
};
