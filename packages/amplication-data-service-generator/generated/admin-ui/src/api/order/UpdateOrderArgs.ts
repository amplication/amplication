import { OrderWhereUniqueInput } from "./OrderWhereUniqueInput";
import { OrderUpdateInput } from "./OrderUpdateInput";

export type UpdateOrderArgs = {
  where: OrderWhereUniqueInput;
  data: OrderUpdateInput;
};
