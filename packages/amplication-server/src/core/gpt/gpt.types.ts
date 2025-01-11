import { JsonObject } from "type-fest";
import { UserAction } from "../../prisma";
import { EnumUserActionStatus } from "../userAction/types";

/**
 * The type of conversation to start. The name stored in the gpt-gateway service db
 */
export enum ConversationTypeKey {
  BreakTheMonolith = "BREAK_THE_MONOLITH",
}

export interface ConversationUserActionMetadata extends JsonObject {
  data: string;
}

export interface ConversationUserAction
  extends Pick<UserAction, "id" | "actionId" | "resourceId"> {
  status: EnumUserActionStatus;
  metadata: ConversationUserActionMetadata;
}
