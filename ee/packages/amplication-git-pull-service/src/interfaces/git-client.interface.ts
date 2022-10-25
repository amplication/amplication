import { PushEventMessage } from "./push-event-message";

export interface GitClient {
  clone: (
    pushEventMessage: PushEventMessage,
    baseDir: string,
    accessToken: string
  ) => Promise<void>;
  pull: (
    pushEventMessage: PushEventMessage,
    baseDir: string,
    accessToken: string
  ) => Promise<void>;
}
