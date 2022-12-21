import { User } from "../user/User";
import { Customer } from "../customer/Customer";

export type Organization = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  users?: Array<User>;
  customers?: Array<Customer>;
  vipCustomers?: Array<Customer>;
};
