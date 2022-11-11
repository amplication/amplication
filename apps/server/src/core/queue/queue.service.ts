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

  emitMessage(topic: string, message: string): void {
    this.kafkaClient.emit(topic, message);
  }
}
