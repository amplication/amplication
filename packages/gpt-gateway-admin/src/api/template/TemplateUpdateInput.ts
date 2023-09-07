import { MessageUpdateManyWithoutTemplatesInput } from "./MessageUpdateManyWithoutTemplatesInput";
import { ConversationTypeUpdateManyWithoutTemplatesInput } from "./ConversationTypeUpdateManyWithoutTemplatesInput";
import { ModelWhereUniqueInput } from "../model/ModelWhereUniqueInput";

export type TemplateUpdateInput = {
  messages?: MessageUpdateManyWithoutTemplatesInput;
  messageTypes?: ConversationTypeUpdateManyWithoutTemplatesInput;
  model?: ModelWhereUniqueInput;
  name?: string;
  params?: string | null;
};
