import { StringFilter } from "../../util/StringFilter";
import { IntFilter } from "../../util/IntFilter";
import { DateTimeFilter } from "../../util/DateTimeFilter";
import { UserWhereUniqueInput } from "./UserWhereUniqueInput";
import { OrganizationListRelationFilter } from "../organization/OrganizationListRelationFilter";
import { BooleanFilter } from "../../util/BooleanFilter";
import { JsonFilter } from "../../util/JsonFilter";
import { ProfileWhereUniqueInput } from "../profile/ProfileWhereUniqueInput";

export type UserWhereInput = {
  id?: StringFilter;
  name?: StringFilter;
  bio?: StringFilter;
  age?: IntFilter;
  birthDate?: DateTimeFilter;
  manager?: UserWhereUniqueInput;
  organizations?: OrganizationListRelationFilter;
  priority?: "high" | "medium" | "low";
  isCurious?: BooleanFilter;
  location?: StringFilter;
  extendedProperties?: JsonFilter;
  profile?: ProfileWhereUniqueInput;
};
