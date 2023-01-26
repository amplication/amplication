import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

export const KAFKA_CLIENT = "KAFKA_CLIENT";

@Injectable()
export class QueueService {
  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly kafkaClient: ClientKafka
  ) {}

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
