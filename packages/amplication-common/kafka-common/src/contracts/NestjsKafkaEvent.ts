import { KafkaMessage } from "kafkajs";

export type NestjsKafkaEvent<DtoValue> = { value: DtoValue } & Omit<
  KafkaMessage,
  "value"
>;
