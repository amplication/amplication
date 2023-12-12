import { MessageWhereUniqueInput } from "./MessageWhereUniqueInput";
import { MessageUpdateInput } from "./MessageUpdateInput";

export type UpdateMessageArgs = {
  where: MessageWhereUniqueInput;
  data: MessageUpdateInput;
};
