import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

export const QUEUE_SERVICE_NAME = "QUEUE_SERVICE";

@Injectable()
export class QueueService implements OnModuleInit {
  constructor(
    @Inject(QUEUE_SERVICE_NAME)
    private readonly kafkaClient: ClientKafka
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async emitMessage(topic: string, message: string): Promise<void> {
    return await new Promise((resolve, reject) => {
      this.kafkaClient.emit(topic, message).subscribe({
        error: (err: any) => {
          reject(err);
        },
        next: () => {
          resolve();
        },
      });
    });
  }
}
