import { Customer } from "../customer/Customer";

export type Order = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  customer?: Customer;
  status?: "pending" | "inProgress" | "done";
  label?: "fragile" | null;
};
