import { CustomerWhereUniqueInput } from "../customer/CustomerWhereUniqueInput";

export type OrderUpdateInput = {
  customer?: CustomerWhereUniqueInput;
  status?: "pending" | "inProgress" | "done";
  label?: "fragile" | null;
};
