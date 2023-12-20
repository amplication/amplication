import { MessageWhereInput } from "./MessageWhereInput";
import { MessageOrderByInput } from "./MessageOrderByInput";

export type MessageFindManyArgs = {
  where?: MessageWhereInput;
  orderBy?: Array<MessageOrderByInput>;
  skip?: number;
  take?: number;
};
