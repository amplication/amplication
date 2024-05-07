import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { KafkaMessage } from "./KafkaMessage";
import { KAFKA_TOPICS } from "@amplication/schema-registry";

@Injectable()
export class KafkaProducerService {
  constructor(@Inject("KAFKA_CLIENT") private kafkaClient: ClientKafka) {}

  async emitMessage(topic: KAFKA_TOPICS, message: KafkaMessage): Promise<void> {
    return await new Promise((resolve, reject) => {
      this.kafkaClient.emit(topic, message).subscribe({
        error: (err: Error) => {
          reject(err);
        },
        next: () => {
          resolve();
        },
      });
    });
  }

  async onModuleInit() {
    await this.kafkaClient.connect();
  }
}
