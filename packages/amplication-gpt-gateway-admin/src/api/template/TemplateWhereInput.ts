import { MessageListRelationFilter } from "../message/MessageListRelationFilter";
import { MessageTypeListRelationFilter } from "../messageType/MessageTypeListRelationFilter";
import { ModelWhereUniqueInput } from "../model/ModelWhereUniqueInput";

export type TemplateWhereInput = {
  messages?: MessageListRelationFilter;
  messageTypes?: MessageTypeListRelationFilter;
  model?: ModelWhereUniqueInput;
};
