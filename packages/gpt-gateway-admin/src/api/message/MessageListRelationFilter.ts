import { MessageWhereInput } from "./MessageWhereInput";

export type MessageListRelationFilter = {
  every?: MessageWhereInput;
  some?: MessageWhereInput;
  none?: MessageWhereInput;
};
