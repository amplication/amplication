import { ModelWhereUniqueInput } from "../model/ModelWhereUniqueInput";
import { ConversationTypeUpdateManyWithoutTemplatesInput } from "./ConversationTypeUpdateManyWithoutTemplatesInput";
import { MessageUpdateManyWithoutTemplatesInput } from "./MessageUpdateManyWithoutTemplatesInput";

export type TemplateUpdateInput = {
  model?: ModelWhereUniqueInput;
  name?: string;
  params?: string | null;
  messageTypes?: ConversationTypeUpdateManyWithoutTemplatesInput;
  messages?: MessageUpdateManyWithoutTemplatesInput;
};
