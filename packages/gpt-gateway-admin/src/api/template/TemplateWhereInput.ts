import { StringFilter } from "../../util/StringFilter";
import { ModelWhereUniqueInput } from "../model/ModelWhereUniqueInput";
import { ConversationTypeListRelationFilter } from "../conversationType/ConversationTypeListRelationFilter";
import { MessageListRelationFilter } from "../message/MessageListRelationFilter";

export type TemplateWhereInput = {
  id?: StringFilter;
  model?: ModelWhereUniqueInput;
  messageTypes?: ConversationTypeListRelationFilter;
  messages?: MessageListRelationFilter;
};
