import { ConversationType as TConversationType } from "../api/conversationType/ConversationType";

export const CONVERSATIONTYPE_TITLE_FIELD = "key";

export const ConversationTypeTitle = (record: TConversationType): string => {
  return record.key || String(record.id);
};
