import { Inject } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

export class KafkaServiceBase {
  constructor(@Inject("KAFKA_CLIENT") private kafkaClient: ClientKafka) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }
}
