import { KafkaMessageHeaders } from "./KafkaMessageHeaders";

export interface KafkaMessage {
  key: string | Record<string, unknown> | null;
  value: string | Record<string, unknown>;
  headers?: KafkaMessageHeaders;
}
