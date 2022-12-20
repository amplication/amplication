import type {
  DecodedKafkaMessage,
  KafkaMessage,
  SchemaIds,
} from "./kafka.types";

export const KAFKA_SERIALIZER = "KAFKA_SERIALIZER";

export interface IKafkaMessageSerializer {
  serialize: (
    message: DecodedKafkaMessage,
    schemaIds?: SchemaIds
  ) => Promise<KafkaMessage>;

  deserialize: (
    message: KafkaMessage
  ) => Promise<DecodedKafkaMessage> | DecodedKafkaMessage;
}
