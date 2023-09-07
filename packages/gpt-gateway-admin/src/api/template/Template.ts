import { Message } from "../message/Message";
import { ConversationType } from "../conversationType/ConversationType";
import { Model } from "../model/Model";

export type Template = {
  createdAt: Date;
  id: string;
  messages?: Array<Message>;
  messageTypes?: Array<ConversationType>;
  model?: Model;
  name: string;
  params: string | null;
  updatedAt: Date;
};
