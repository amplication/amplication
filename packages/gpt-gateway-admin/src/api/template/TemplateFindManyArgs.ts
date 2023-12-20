import { TemplateWhereInput } from "./TemplateWhereInput";
import { TemplateOrderByInput } from "./TemplateOrderByInput";

export type TemplateFindManyArgs = {
  where?: TemplateWhereInput;
  orderBy?: Array<TemplateOrderByInput>;
  skip?: number;
  take?: number;
};
