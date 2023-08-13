import { TemplateWhereUniqueInput } from "../template/TemplateWhereUniqueInput";

export type MessageTypeCreateInput = {
  key: string;
  template?: TemplateWhereUniqueInput | null;
};
