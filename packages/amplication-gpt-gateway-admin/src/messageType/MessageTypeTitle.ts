import { MessageType as TMessageType } from "../api/messageType/MessageType";

export const MESSAGETYPE_TITLE_FIELD = "key";

export const MessageTypeTitle = (record: TMessageType): string => {
  return record.key || String(record.id);
};
