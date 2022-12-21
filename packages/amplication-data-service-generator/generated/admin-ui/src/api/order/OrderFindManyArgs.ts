import { OrderWhereInput } from "./OrderWhereInput";
import { OrderOrderByInput } from "./OrderOrderByInput";

export type OrderFindManyArgs = {
  where?: OrderWhereInput;
  orderBy?: Array<OrderOrderByInput>;
  skip?: number;
  take?: number;
};
