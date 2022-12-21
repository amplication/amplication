import { UserCreateNestedManyWithoutOrganizationsInput } from "./UserCreateNestedManyWithoutOrganizationsInput";
import { CustomerCreateNestedManyWithoutOrganizationsInput } from "./CustomerCreateNestedManyWithoutOrganizationsInput";

export type OrganizationCreateInput = {
  name: string;
  users?: UserCreateNestedManyWithoutOrganizationsInput;
  customers?: CustomerCreateNestedManyWithoutOrganizationsInput;
  vipCustomers?: CustomerCreateNestedManyWithoutOrganizationsInput;
};
