import { SortOrder } from "../../util/SortOrder";

export type VersionOrderByInput = {
  id?: SortOrder;
  createdAt?: SortOrder;
  updatedAt?: SortOrder;
  name?: SortOrder;
  changelog?: SortOrder;
  isDeprecated?: SortOrder;
  deletedAt?: SortOrder;
  isActive?: SortOrder;
  generatorId?: SortOrder;
};
