import { Message } from "../message/Message";
import { MessageType } from "../messageType/MessageType";
import { Model } from "../model/Model";

export type Template = {
  createdAt: Date;
  id: string;
  messages?: Array<Message>;
  messageTypes?: Array<MessageType>;
  model?: Model;
  name: string;
  params: string | null;
  updatedAt: Date;
};
