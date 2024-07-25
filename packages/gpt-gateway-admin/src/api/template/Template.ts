import { Model } from "../model/Model";
import { ConversationType } from "../conversationType/ConversationType";
import { Message } from "../message/Message";

export type Template = {
  createdAt: Date;
  id: string;
  model?: Model;
  name: string;
  params: string | null;
  updatedAt: Date;
  messageTypes?: Array<ConversationType>;
  messages?: Array<Message>;
};
