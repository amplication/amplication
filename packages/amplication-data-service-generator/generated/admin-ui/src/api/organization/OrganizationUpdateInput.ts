import { UserUpdateManyWithoutOrganizationsInput } from "./UserUpdateManyWithoutOrganizationsInput";
import { CustomerUpdateManyWithoutOrganizationsInput } from "./CustomerUpdateManyWithoutOrganizationsInput";

export type OrganizationUpdateInput = {
  name?: string;
  users?: UserUpdateManyWithoutOrganizationsInput;
  customers?: CustomerUpdateManyWithoutOrganizationsInput;
  vipCustomers?: CustomerUpdateManyWithoutOrganizationsInput;
};
