import { OrganizationWhereInput } from "./OrganizationWhereInput";
import { OrganizationOrderByInput } from "./OrganizationOrderByInput";

export type OrganizationFindManyArgs = {
  where?: OrganizationWhereInput;
  orderBy?: Array<OrganizationOrderByInput>;
  skip?: number;
  take?: number;
};
