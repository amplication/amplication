import { SortOrder } from "../../util/SortOrder";

export type VersionOrderByInput = {
  changelog?: SortOrder;
  createdAt?: SortOrder;
  deletedAt?: SortOrder;
  generatorId?: SortOrder;
  id?: SortOrder;
  isActive?: SortOrder;
  isDeprecated?: SortOrder;
  name?: SortOrder;
  updatedAt?: SortOrder;
};
