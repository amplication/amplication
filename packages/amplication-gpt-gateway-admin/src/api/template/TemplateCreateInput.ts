import { MessageCreateNestedManyWithoutTemplatesInput } from "./MessageCreateNestedManyWithoutTemplatesInput";
import { ConversationTypeCreateNestedManyWithoutTemplatesInput } from "./ConversationTypeCreateNestedManyWithoutTemplatesInput";
import { ModelWhereUniqueInput } from "../model/ModelWhereUniqueInput";

export type TemplateCreateInput = {
  messages?: MessageCreateNestedManyWithoutTemplatesInput;
  messageTypes?: ConversationTypeCreateNestedManyWithoutTemplatesInput;
  model: ModelWhereUniqueInput;
  name: string;
  params?: string | null;
};
