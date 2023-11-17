import { Template as TTemplate } from "../api/template/Template";

export const TEMPLATE_TITLE_FIELD = "name";

export const TemplateTitle = (record: TTemplate): string => {
  return record.name || String(record.id);
};
