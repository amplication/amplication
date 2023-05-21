import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaTopics } from './queue.types';
import { CreateRepositoryPush } from './dto/create-repository-push.dto';
import { CreateEventRepositoryPush } from './dto/create-event-repository-push.dto';
import { ConfigService } from '@nestjs/config';
import { AmplicationLogger } from '@amplication/util/nestjs/logging';

export const QUEUE_SERVICE_NAME = 'REPOSITORY_PUSH_EVENT_SERVICE';

@Injectable()
export class QueueService {
  private kafkaRepositoryPushQueue: string;

  constructor(
    @Inject(QUEUE_SERVICE_NAME)
    private readonly repositoryClient: ClientKafka,
    configService: ConfigService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
  ) {
    this.kafkaRepositoryPushQueue = configService.get<string>(
      KafkaTopics.KafkaRepositoryPush,
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
  }: CreateRepositoryPush) {
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
        new CreateEventRepositoryPush(
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
        `failed to push message to kafka: method: createPushRequest`,
        error,
        { class: QueueService.name, messageId },
      );
    }
  }
}
