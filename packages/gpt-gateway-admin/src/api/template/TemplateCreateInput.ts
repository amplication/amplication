import { ModelWhereUniqueInput } from "../model/ModelWhereUniqueInput";
import { ConversationTypeCreateNestedManyWithoutTemplatesInput } from "./ConversationTypeCreateNestedManyWithoutTemplatesInput";
import { MessageCreateNestedManyWithoutTemplatesInput } from "./MessageCreateNestedManyWithoutTemplatesInput";

export type TemplateCreateInput = {
  model: ModelWhereUniqueInput;
  name: string;
  params?: string | null;
  messageTypes?: ConversationTypeCreateNestedManyWithoutTemplatesInput;
  messages?: MessageCreateNestedManyWithoutTemplatesInput;
};
