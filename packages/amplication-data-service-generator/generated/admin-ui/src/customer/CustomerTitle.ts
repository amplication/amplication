import { Customer as TCustomer } from "../api/customer/Customer";

export const CUSTOMER_TITLE_FIELD = "firstName";

export const CustomerTitle = (record: TCustomer): string => {
  return record.firstName || String(record.id);
};
