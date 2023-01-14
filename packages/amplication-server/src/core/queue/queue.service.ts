import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

export const QUEUE_SERVICE_NAME = "QUEUE_SERVICE";

@Injectable()
export class QueueService implements OnModuleInit {
  generatePullRequestTopic: string;
  constructor(
    @Inject(QUEUE_SERVICE_NAME)
    private readonly kafkaClient: ClientKafka
  ) {}

  async onModuleInit() {
    // Explicitly wait for kafka client to connect. https://github.com/nestjs/nest/issues/10449
    await this.kafkaClient.connect();
  }

  emitMessage(topic: string, message: string): void {
    this.kafkaClient.emit(topic, message);
  }
}
