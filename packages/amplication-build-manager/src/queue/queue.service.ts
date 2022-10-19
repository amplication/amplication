import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

export const KAFKA_CLIENT = 'KAFKA_CLIENT';

@Injectable()
export class QueueService {
  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly kafkaClient: ClientKafka,
  ) {}

  emitMessage(topic: string, message: string): void {
    this.kafkaClient.emit(topic, message);
  }
}
