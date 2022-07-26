import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

export const KAFKA_CLIENT = 'KAFKA_CLIENT';

@Injectable()
export class QueueService {
  private readonly observer = {
    next(data) {
      console.log(data);
    },
    error(e) {
      console.log(e);
    },
    complete() {
      console.log('request complete');
    },
  };

  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly kafkaClient: ClientKafka,
  ) {}

  emitMessage(topic: string, message: string): void {
    const response = this.kafkaClient.emit(topic, message);
    response.subscribe(this.observer);
  }
}
