import { CustomerWhereUniqueInput } from "./CustomerWhereUniqueInput";
import { CustomerUpdateInput } from "./CustomerUpdateInput";

export type UpdateCustomerArgs = {
  where: CustomerWhereUniqueInput;
  data: CustomerUpdateInput;
};
