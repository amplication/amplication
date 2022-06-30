import { PushEventMessage } from './pushEventMessage';

export interface IGitPullEvent {
  handlePushEvent: (pushEventMessage: PushEventMessage) => Promise<void>;
}
