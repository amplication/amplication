import { Order as TOrder } from "../api/order/Order";

export const ORDER_TITLE_FIELD = "id";

export const OrderTitle = (record: TOrder): string => {
  return record.id || String(record.id);
};
