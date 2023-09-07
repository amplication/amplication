import { ConversationTypeWhereInput } from "./ConversationTypeWhereInput";
import { ConversationTypeOrderByInput } from "./ConversationTypeOrderByInput";

export type ConversationTypeFindManyArgs = {
  where?: ConversationTypeWhereInput;
  orderBy?: Array<ConversationTypeOrderByInput>;
  skip?: number;
  take?: number;
};
