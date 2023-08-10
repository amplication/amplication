import { SortOrder } from "../../util/SortOrder";

export type MessageTypeOrderByInput = {
  createdAt?: SortOrder;
  id?: SortOrder;
  key?: SortOrder;
  templateId?: SortOrder;
  updatedAt?: SortOrder;
};
