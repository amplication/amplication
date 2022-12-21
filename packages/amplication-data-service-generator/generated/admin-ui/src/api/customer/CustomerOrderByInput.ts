import { SortOrder } from "../../util/SortOrder";

export type CustomerOrderByInput = {
  id?: SortOrder;
  createdAt?: SortOrder;
  updatedAt?: SortOrder;
  email?: SortOrder;
  firstName?: SortOrder;
  lastName?: SortOrder;
  isVip?: SortOrder;
  birthData?: SortOrder;
  averageSale?: SortOrder;
  favoriteNumber?: SortOrder;
  geoLocation?: SortOrder;
  comments?: SortOrder;
  favoriteColors?: SortOrder;
  customerType?: SortOrder;
  organizationId?: SortOrder;
  vipOrganizationId?: SortOrder;
};
