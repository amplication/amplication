import { CustomerWhereInput } from "./CustomerWhereInput";
import { CustomerOrderByInput } from "./CustomerOrderByInput";

export type CustomerFindManyArgs = {
  where?: CustomerWhereInput;
  orderBy?: Array<CustomerOrderByInput>;
  skip?: number;
  take?: number;
};
