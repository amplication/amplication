import { ConversationType } from "../conversationType/ConversationType";
import { Message } from "../message/Message";
import { Model } from "../model/Model";

export type Template = {
  createdAt: Date;
  id: string;
  messageTypes?: Array<ConversationType>;
  messages?: Array<Message>;
  model?: Model;
  name: string;
  params: string | null;
  updatedAt: Date;
};
