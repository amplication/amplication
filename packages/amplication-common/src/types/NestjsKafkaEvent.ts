import { KafkaMessage } from "kafkajs";

export type NestjsKafkaEvent<DtoType> = Omit<KafkaMessage, "value"> & {
  value: DtoType;
};
