import { StringFilter } from "../../util/StringFilter";
import { MessageListRelationFilter } from "../message/MessageListRelationFilter";
import { ConversationTypeListRelationFilter } from "../conversationType/ConversationTypeListRelationFilter";
import { ModelWhereUniqueInput } from "../model/ModelWhereUniqueInput";

export type TemplateWhereInput = {
  id?: StringFilter;
  messages?: MessageListRelationFilter;
  messageTypes?: ConversationTypeListRelationFilter;
  model?: ModelWhereUniqueInput;
};
