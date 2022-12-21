import { StringFilter } from "../../util/StringFilter";
import { DateTimeFilter } from "../../util/DateTimeFilter";
import { UserListRelationFilter } from "../user/UserListRelationFilter";
import { CustomerListRelationFilter } from "../customer/CustomerListRelationFilter";

export type OrganizationWhereInput = {
  id?: StringFilter;
  createdAt?: DateTimeFilter;
  updatedAt?: DateTimeFilter;
  name?: StringFilter;
  users?: UserListRelationFilter;
  customers?: CustomerListRelationFilter;
  vipCustomers?: CustomerListRelationFilter;
};
