import { StringFilter } from "../../util/StringFilter";
import { ConversationTypeListRelationFilter } from "../conversationType/ConversationTypeListRelationFilter";
import { MessageListRelationFilter } from "../message/MessageListRelationFilter";
import { ModelWhereUniqueInput } from "../model/ModelWhereUniqueInput";

export type TemplateWhereInput = {
  id?: StringFilter;
  messageTypes?: ConversationTypeListRelationFilter;
  messages?: MessageListRelationFilter;
  model?: ModelWhereUniqueInput;
};
