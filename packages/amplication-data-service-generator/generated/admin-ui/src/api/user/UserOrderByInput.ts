import { SortOrder } from "../../util/SortOrder";

export type UserOrderByInput = {
  username?: SortOrder;
  password?: SortOrder;
  roles?: SortOrder;
  id?: SortOrder;
  name?: SortOrder;
  bio?: SortOrder;
  email?: SortOrder;
  age?: SortOrder;
  birthDate?: SortOrder;
  score?: SortOrder;
  managerId?: SortOrder;
  interests?: SortOrder;
  priority?: SortOrder;
  isCurious?: SortOrder;
  location?: SortOrder;
  extendedProperties?: SortOrder;
  profileId?: SortOrder;
};
