import {
  DecodedKafkaMessage,
  IKafkaMessageSerializer,
  KAFKA_SERIALIZER,
  SchemaIds,
} from "@amplication/util/kafka";
import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

export const KAFKA_PRODUCER_SERVICE_NAME = "KAFKA_PRODUCER_SERVICE";

@Injectable()
export class KafkaProducerService {
  generatePullRequestTopic: string;
  constructor(
    @Inject(ClientKafka)
    private readonly kafkaClient: ClientKafka,
    @Inject(KAFKA_SERIALIZER)
    private readonly serializer: IKafkaMessageSerializer
  ) {}

  async emitMessage(
    topic: string,
    message: DecodedKafkaMessage,
    schemaIds?: SchemaIds
  ): Promise<void> {
    const kafkaMessage = await this.serializer.serialize(message, schemaIds);
    this.kafkaClient.emit(topic, kafkaMessage);
  }
}
