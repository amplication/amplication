import { StringNullableFilter } from "../../util/StringNullableFilter";
import { StringFilter } from "../../util/StringFilter";
import { VersionListRelationFilter } from "../version/VersionListRelationFilter";

export type GeneratorWhereInput = {
  fullName?: StringNullableFilter;
  id?: StringFilter;
  name?: StringNullableFilter;
  version?: VersionListRelationFilter;
};
