import { PushEventMessage } from "./pushEventMessage";

export interface IGitPullEvent {
  pushEventHandler: (pushEventMessage: PushEventMessage) => Promise<void>;
}
