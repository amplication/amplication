import {
  DecodedKafkaMessage,
  IKafkaMessageSerializer,
  KAFKA_SERIALIZER,
  SchemaIds,
} from "@amplication/util/kafka";
import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { KAFKA_CLIENT } from "../createNestjsKafkaConfig";

export const KAFKA_PRODUCER_SERVICE_NAME = "KAFKA_PRODUCER_SERVICE";

@Injectable()
export class KafkaProducerService {
  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly kafkaClient: ClientKafka,
    @Inject(KAFKA_SERIALIZER)
    private readonly serializer: IKafkaMessageSerializer
  ) {}

  async emitMessage(
    topic: string,
    message: DecodedKafkaMessage,
    schemaIds?: SchemaIds
  ): Promise<void> {
   if (!schemaIds) {
    throw new Error('Missing schema IDs');
  }
    const validationResult = await this.kafkaClient.validate(topic, message, schemaIds);
   if (validationResult.errors) {
    throw new Error('Message does not conform to the specified schema');
  }
    const kafkaMessage = await this.serializer.serialize(message, schemaIds);
    return await new Promise((resolve, reject) => {
      this.kafkaClient.emit(topic, kafkaMessage).subscribe({
        error: (err: Error) => {
          reject(err);
        },
        next: () => {
          resolve();
        },
      });
    });
  }
}
