import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

export const QUEUE_SERVICE_NAME = "QUEUE_SERVICE";

@Injectable()
export class QueueService {
  generatePullRequestTopic: string;
  constructor(
    @Inject(QUEUE_SERVICE_NAME)
    private readonly kafkaClient: ClientKafka
  ) {}

  async emitMessage(topic: string, message: string): Promise<void> {
    // Explicitly wait for kafka client to connect. https://github.com/nestjs/nest/issues/10449
    await this.kafkaClient.connect();

    this.kafkaClient.emit(topic, message);
  }
}
