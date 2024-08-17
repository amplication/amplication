import { ConversationTypeCreateNestedManyWithoutTemplatesInput } from "./ConversationTypeCreateNestedManyWithoutTemplatesInput";
import { MessageCreateNestedManyWithoutTemplatesInput } from "./MessageCreateNestedManyWithoutTemplatesInput";
import { ModelWhereUniqueInput } from "../model/ModelWhereUniqueInput";

export type TemplateCreateInput = {
  messageTypes?: ConversationTypeCreateNestedManyWithoutTemplatesInput;
  messages?: MessageCreateNestedManyWithoutTemplatesInput;
  model: ModelWhereUniqueInput;
  name: string;
  params?: string | null;
};
