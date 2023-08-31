import { StringNullableFilter } from "../../util/StringNullableFilter";
import { DateTimeNullableFilter } from "../../util/DateTimeNullableFilter";
import { BooleanNullableFilter } from "../../util/BooleanNullableFilter";
import { StringFilter } from "../../util/StringFilter";

export type VersionWhereInput = {
  changelog?: StringNullableFilter;
  deletedAt?: DateTimeNullableFilter;
  deprecated?: BooleanNullableFilter;
  id?: StringFilter;
  name?: StringNullableFilter;
};
