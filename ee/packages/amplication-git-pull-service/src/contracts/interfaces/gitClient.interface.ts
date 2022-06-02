import { PushEventMessage } from './pushEventMessage';

export interface IGitClient {
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
