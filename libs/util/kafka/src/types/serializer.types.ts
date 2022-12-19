import type {
  DecodedKafkaMessage,
  KafkaMessage,
  SchemaIds,
} from "./kafka.types";

export interface IKafkaMessageSerializer {
  serialize: (
    message: DecodedKafkaMessage,
    schemaIds?: SchemaIds
  ) => Promise<KafkaMessage>;

  deserialize: (
    message: KafkaMessage
  ) => Promise<DecodedKafkaMessage> | DecodedKafkaMessage;
}
