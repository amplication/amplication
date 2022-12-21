import { StringFilter } from "../../util/StringFilter";
import { DateTimeFilter } from "../../util/DateTimeFilter";
import { StringNullableFilter } from "../../util/StringNullableFilter";
import { BooleanNullableFilter } from "../../util/BooleanNullableFilter";
import { DateTimeNullableFilter } from "../../util/DateTimeNullableFilter";
import { FloatNullableFilter } from "../../util/FloatNullableFilter";
import { IntNullableFilter } from "../../util/IntNullableFilter";
import { OrganizationWhereUniqueInput } from "../organization/OrganizationWhereUniqueInput";
import { OrderListRelationFilter } from "../order/OrderListRelationFilter";

export type CustomerWhereInput = {
  id?: StringFilter;
  createdAt?: DateTimeFilter;
  updatedAt?: DateTimeFilter;
  email?: StringFilter;
  firstName?: StringNullableFilter;
  lastName?: StringNullableFilter;
  isVip?: BooleanNullableFilter;
  birthData?: DateTimeNullableFilter;
  averageSale?: FloatNullableFilter;
  favoriteNumber?: IntNullableFilter;
  geoLocation?: StringNullableFilter;
  comments?: StringNullableFilter;
  customerType?: "platinum" | "gold" | "bronze" | "regular";
  organization?: OrganizationWhereUniqueInput;
  vipOrganization?: OrganizationWhereUniqueInput;
  orders?: OrderListRelationFilter;
};
