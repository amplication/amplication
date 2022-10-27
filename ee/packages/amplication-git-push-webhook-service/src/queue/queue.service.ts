import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { QueueInterface } from './queue.types';
import { CreateRepositoryPushRequest } from './dto/create-repository-push-request';
import { RepositoryPushCreateEvent } from './dto/repository-push-create-event';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

export const QUEUE_SERVICE_NAME = 'REPOSITORY_PUSH_EVENT_SERVICE';
const KAFKA_REPOSITORY_PUSH_QUEUE_VAR = 'KAFKA_REPOSITORY_PUSH_QUEUE';
@Injectable()
export class QueueService implements QueueInterface {
  private kafkaRepositoryPushQueue: string;

  constructor(
    @Inject(QUEUE_SERVICE_NAME)
    private readonly repositoryClient: ClientKafka,
    configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.kafkaRepositoryPushQueue = configService.get<string>(
      KAFKA_REPOSITORY_PUSH_QUEUE_VAR,
    );
  }
  async createPushRequest({
    provider,
    repositoryOwner,
    repositoryName,
    branch,
    commit,
    pushedAt,
    installationId,
    messageId,
  }: CreateRepositoryPushRequest) {
    this.logger.log('start createPushRequest', {
      class: QueueService.name,
      createRepositoryPushRequest: {
        provider,
        repositoryName,
        repositoryOwner,
        branch,
        commit,
        pushedAt,
        installationId,
        messageId,
      },
    });

    try {
      await this.repositoryClient.emit(
        this.kafkaRepositoryPushQueue,
        new RepositoryPushCreateEvent(
          provider,
          repositoryOwner,
          repositoryName,
          branch,
          commit,
          pushedAt,
          installationId.toString(),
        ),
      );
    } catch (error) {
      this.logger.error(
        `failed to push message to kafka: method: createPushRequest, error: ${error}`,
        { class: QueueService.name, messageId },
      );
    }
  }
}
