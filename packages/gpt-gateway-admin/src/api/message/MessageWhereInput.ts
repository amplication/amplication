import { StringFilter } from "../../util/StringFilter";
import { TemplateWhereUniqueInput } from "../template/TemplateWhereUniqueInput";

export type MessageWhereInput = {
  id?: StringFilter;
  template?: TemplateWhereUniqueInput;
};
