import { MessageCreateNestedManyWithoutTemplatesInput } from "./MessageCreateNestedManyWithoutTemplatesInput";
import { MessageTypeCreateNestedManyWithoutTemplatesInput } from "./MessageTypeCreateNestedManyWithoutTemplatesInput";
import { ModelWhereUniqueInput } from "../model/ModelWhereUniqueInput";

export type TemplateCreateInput = {
  messages?: MessageCreateNestedManyWithoutTemplatesInput;
  messageTypes?: MessageTypeCreateNestedManyWithoutTemplatesInput;
  model: ModelWhereUniqueInput;
  name: string;
  params?: string | null;
};
