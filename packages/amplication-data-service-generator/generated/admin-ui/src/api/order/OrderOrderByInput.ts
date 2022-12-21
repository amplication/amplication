import { SortOrder } from "../../util/SortOrder";

export type OrderOrderByInput = {
  id?: SortOrder;
  createdAt?: SortOrder;
  updatedAt?: SortOrder;
  customerId?: SortOrder;
  status?: SortOrder;
  label?: SortOrder;
};
