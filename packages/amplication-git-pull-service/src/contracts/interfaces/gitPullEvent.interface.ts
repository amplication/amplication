import { PushEventMessage } from "./pushEventMessage";

export interface IGitPullEvent {
  HandlePushEvent: (pushEventMessage: PushEventMessage) => Promise<void>;
}
