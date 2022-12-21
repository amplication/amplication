import { OrganizationWhereUniqueInput } from "../organization/OrganizationWhereUniqueInput";
import { OrderCreateNestedManyWithoutCustomersInput } from "./OrderCreateNestedManyWithoutCustomersInput";

export type CustomerCreateInput = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  isVip?: boolean | null;
  birthData?: Date | null;
  averageSale?: number | null;
  favoriteNumber?: number | null;
  geoLocation?: string | null;
  comments?: string | null;
  favoriteColors?: Array<"red" | "green" | "purple" | "yellow">;
  customerType?: "platinum" | "gold" | "bronze" | "regular" | null;
  organization?: OrganizationWhereUniqueInput | null;
  vipOrganization?: OrganizationWhereUniqueInput | null;
  orders?: OrderCreateNestedManyWithoutCustomersInput;
};
