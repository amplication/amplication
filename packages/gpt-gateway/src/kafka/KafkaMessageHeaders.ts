export interface KafkaMessageHeaders {
  [key: string]: Buffer | string | undefined;
}
