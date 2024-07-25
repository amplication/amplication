import { StringFilter } from "../../util/StringFilter";
import { StringNullableFilter } from "../../util/StringNullableFilter";
import { BooleanNullableFilter } from "../../util/BooleanNullableFilter";
import { DateTimeNullableFilter } from "../../util/DateTimeNullableFilter";
import { BooleanFilter } from "../../util/BooleanFilter";
import { GeneratorWhereUniqueInput } from "../generator/GeneratorWhereUniqueInput";

export type VersionWhereInput = {
  id?: StringFilter;
  name?: StringFilter;
  changelog?: StringNullableFilter;
  isDeprecated?: BooleanNullableFilter;
  deletedAt?: DateTimeNullableFilter;
  isActive?: BooleanFilter;
  generator?: GeneratorWhereUniqueInput;
};
