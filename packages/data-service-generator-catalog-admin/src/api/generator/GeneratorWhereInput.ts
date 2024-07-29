import { StringNullableFilter } from "../../util/StringNullableFilter";
import { StringFilter } from "../../util/StringFilter";
import { BooleanNullableFilter } from "../../util/BooleanNullableFilter";
import { VersionListRelationFilter } from "../version/VersionListRelationFilter";

export type GeneratorWhereInput = {
  fullName?: StringNullableFilter;
  id?: StringFilter;
  isActive?: BooleanNullableFilter;
  name?: StringNullableFilter;
  version?: VersionListRelationFilter;
};
