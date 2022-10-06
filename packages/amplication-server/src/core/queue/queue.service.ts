import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { GENERATE_PULL_REQUEST_TOPIC } from '../../constants';
import assert from 'assert';

export const QUEUE_SERVICE_NAME = 'QUEUE_SERVICE';

@Injectable()
export class QueueService {
  generatePullRequestTopic: string;
  constructor(
    @Inject(QUEUE_SERVICE_NAME)
    private readonly kafkaClient: ClientKafka,
    configService: ConfigService
  ) {
    const envGeneratePullRequestTopic = configService.get<string>(
      GENERATE_PULL_REQUEST_TOPIC
    );
    assert(
      envGeneratePullRequestTopic,
      'Missing env for generate pull request topics'
    );
    this.generatePullRequestTopic = envGeneratePullRequestTopic;
  }

  emitMessage(topic: string, message: string): void {
    this.kafkaClient.emit(topic, message);
  }

  emitCreatePullRequestMessage(message: string): void {
    this.emitMessage(this.generatePullRequestTopic, message);
  }
}
