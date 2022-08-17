import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Consumer } from 'sqs-consumer';

@Injectable()
export class ProxyService {
  constructor(
    private configService: ConfigService,
    @Inject('KAFKA_CLIENT') private kafkaClient: ClientProxy,
  ) {
    this.subscribeToSQSQueue();
  }

  async subscribeToSQSQueue() {
    const queueUrl = this.configService.get('SOURCE_SQS_QUEUE_URL');

    const subscription = Consumer.create({
      queueUrl,
      handleMessage: async (message) => {
        console.log('received message', message);
        this.forwardMessageToKafka(message.Body);
      },
    });

    subscription.on('error', (err) => {
      console.error(err.message);
    });

    subscription.on('processing_error', (err) => {
      console.error(err.message);
    });

    subscription.start();
  }

  async forwardMessageToKafka(payload: any) {
    this.kafkaClient.emit(
      this.configService.get('TARGET_KAFKA_TOPIC'),
      payload,
    );
  }
}
