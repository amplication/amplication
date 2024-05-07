import { StringFilter } from "../../util/StringFilter";
import { TemplateListRelationFilter } from "../template/TemplateListRelationFilter";

export type ModelWhereInput = {
  id?: StringFilter;
  templates?: TemplateListRelationFilter;
};
