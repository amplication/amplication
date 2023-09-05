import { StringNullableFilter } from "../../util/StringNullableFilter";
import { DateTimeNullableFilter } from "../../util/DateTimeNullableFilter";
import { StringFilter } from "../../util/StringFilter";
import { BooleanFilter } from "../../util/BooleanFilter";
import { BooleanNullableFilter } from "../../util/BooleanNullableFilter";

export type VersionWhereInput = {
  changelog?: StringNullableFilter;
  deletedAt?: DateTimeNullableFilter;
  id?: StringFilter;
  isActive?: BooleanFilter;
  isDeprecated?: BooleanNullableFilter;
  name?: StringNullableFilter;
};
