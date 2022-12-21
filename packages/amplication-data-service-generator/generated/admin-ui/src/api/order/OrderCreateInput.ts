import { CustomerWhereUniqueInput } from "../customer/CustomerWhereUniqueInput";

export type OrderCreateInput = {
  customer: CustomerWhereUniqueInput;
  status: "pending" | "inProgress" | "done";
  label?: "fragile" | null;
};
