import { ConversationTypeUpdateManyWithoutTemplatesInput } from "./ConversationTypeUpdateManyWithoutTemplatesInput";
import { MessageUpdateManyWithoutTemplatesInput } from "./MessageUpdateManyWithoutTemplatesInput";
import { ModelWhereUniqueInput } from "../model/ModelWhereUniqueInput";

export type TemplateUpdateInput = {
  messageTypes?: ConversationTypeUpdateManyWithoutTemplatesInput;
  messages?: MessageUpdateManyWithoutTemplatesInput;
  model?: ModelWhereUniqueInput;
  name?: string;
  params?: string | null;
};
