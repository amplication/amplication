import { StringFilter } from "../../util/StringFilter";
import { StringNullableFilter } from "../../util/StringNullableFilter";
import { VersionListRelationFilter } from "../version/VersionListRelationFilter";
import { BooleanNullableFilter } from "../../util/BooleanNullableFilter";

export type GeneratorWhereInput = {
  id?: StringFilter;
  name?: StringNullableFilter;
  fullName?: StringNullableFilter;
  version?: VersionListRelationFilter;
  isActive?: BooleanNullableFilter;
};
