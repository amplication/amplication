import { PushEventMessage } from "./push-event-message";

export interface GitPullEvent {
  handlePushEvent: (pushEventMessage: PushEventMessage) => Promise<void>;
}
