import { TemplateWhereUniqueInput } from "../template/TemplateWhereUniqueInput";

export type ConversationTypeCreateInput = {
  key: string;
  template?: TemplateWhereUniqueInput | null;
};
