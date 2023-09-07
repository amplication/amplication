import { TemplateWhereUniqueInput } from "../template/TemplateWhereUniqueInput";

export type MessageCreateInput = {
  content: string;
  position?: number | null;
  role: "User" | "System" | "Assistant";
  template?: TemplateWhereUniqueInput | null;
};
