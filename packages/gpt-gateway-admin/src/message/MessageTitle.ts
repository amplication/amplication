import { Message as TMessage } from "../api/message/Message";

export const MESSAGE_TITLE_FIELD = "content";

export const MessageTitle = (record: TMessage): string => {
  return record.content?.toString() || String(record.id);
};
