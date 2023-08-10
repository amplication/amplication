import { MessageUpdateManyWithoutTemplatesInput } from "./MessageUpdateManyWithoutTemplatesInput";
import { MessageTypeUpdateManyWithoutTemplatesInput } from "./MessageTypeUpdateManyWithoutTemplatesInput";
import { ModelWhereUniqueInput } from "../model/ModelWhereUniqueInput";

export type TemplateUpdateInput = {
  messages?: MessageUpdateManyWithoutTemplatesInput;
  messageTypes?: MessageTypeUpdateManyWithoutTemplatesInput;
  model?: ModelWhereUniqueInput;
  name?: string;
  params?: string | null;
};
