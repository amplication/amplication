import { MessageListRelationFilter } from "../message/MessageListRelationFilter";
import { ConversationTypeListRelationFilter } from "../conversationType/ConversationTypeListRelationFilter";
import { ModelWhereUniqueInput } from "../model/ModelWhereUniqueInput";

export type TemplateWhereInput = {
  messages?: MessageListRelationFilter;
  messageTypes?: ConversationTypeListRelationFilter;
  model?: ModelWhereUniqueInput;
};
