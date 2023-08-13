import { MessageTypeWhereInput } from "./MessageTypeWhereInput";
import { MessageTypeOrderByInput } from "./MessageTypeOrderByInput";

export type MessageTypeFindManyArgs = {
  where?: MessageTypeWhereInput;
  orderBy?: Array<MessageTypeOrderByInput>;
  skip?: number;
  take?: number;
};
