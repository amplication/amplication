import { TemplateCreateNestedManyWithoutModelsInput } from "./TemplateCreateNestedManyWithoutModelsInput";

export type ModelCreateInput = {
  name: string;
  templates?: TemplateCreateNestedManyWithoutModelsInput;
};
