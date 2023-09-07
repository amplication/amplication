import { TemplateWhereUniqueInput } from "../template/TemplateWhereUniqueInput";

export type MessageUpdateInput = {
  content?: string;
  position?: number | null;
  role?: "User" | "System" | "Assistant";
  template?: TemplateWhereUniqueInput | null;
};
