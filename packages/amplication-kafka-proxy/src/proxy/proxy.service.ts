import {
  AmplicationLogger,
  AMPLICATION_LOGGER_PROVIDER,
} from '@amplication/nest-logger-module';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Consumer } from 'sqs-consumer';

@Injectable()
export class ProxyService {
  constructor(
    private configService: ConfigService,
    @Inject('KAFKA_CLIENT') private kafkaClient: ClientProxy,
    @Inject(AMPLICATION_LOGGER_PROVIDER)
    private readonly logger: AmplicationLogger,
  ) {
    this.subscribeToSQSQueue();
  }

  async subscribeToSQSQueue() {
    const queueUrl = this.configService.get('SOURCE_SQS_QUEUE_URL');

    const subscription = Consumer.create({
      queueUrl,
      handleMessage: async (message) => {
        this.forwardMessageToKafka(message.Body);
      },
    });

    subscription.on('error', (err) => {
      this.logger.error(err.message, { err });
    });

    subscription.on('processing_error', (err) => {
      this.logger.error(err.message, { err });
    });

    subscription.start();
    this.logger.info('Subscribed to SQS queue');
  }

  async forwardMessageToKafka(payload: any) {
    this.kafkaClient.emit(
      this.configService.get('TARGET_KAFKA_TOPIC'),
      payload,
    );
  }
}
