import {
  Inject,
  Injectable,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { GET_BUILD_BY_RUN_ID_TOPIC } from '../constants';

export const KAFKA_CLIENT = 'KAFKA_CLIENT';

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly getBuildByRunIdTopic: string;

  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly kafkaClient: ClientKafka,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {
    this.getBuildByRunIdTopic = this.configService.get<string>(
      GET_BUILD_BY_RUN_ID_TOPIC,
    );
  }

  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(this.getBuildByRunIdTopic);
  }

  emitMessage(topic: string, message: string): void {
    const logger = this.logger;
    const observer = {
      error(error: Error): void {
        logger.error(
          `failed to push message to kafka: method: emitMessage topic: ${topic}, message: ${message} error: ${error}`,
          { error, class: QueueService.name, topic, message },
        );
      },
    };

    const response = this.kafkaClient.emit(topic, message);
    response.subscribe(observer);
  }

  sendMessage(topic: string, message: string) {
    const logger = this.logger;
    let result;
    return new Promise((resolve, reject) => {
      this.kafkaClient.send(topic, message).subscribe({
        next: (data) => {
          result = data;
        },
        complete: () => {
          resolve(result);
        },
        error(error: Error): void {
          logger.error(
            `failed to push message to kafka: method: sendMessage topic: ${topic}, message: ${message} error: ${error}`,
            { error, class: QueueService.name, topic, message },
          );
          reject(error);
        },
      });
    });
  }
}
