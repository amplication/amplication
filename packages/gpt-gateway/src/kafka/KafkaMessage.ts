import { KafkaMessageHeaders } from "./KafkaMessageHeaders";

export interface KafkaMessage {
  key: string | Record<string, any> | null;
  value: string | Record<string, any>;
  headers?: KafkaMessageHeaders;
}
