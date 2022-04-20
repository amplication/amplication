import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { QueueInterface } from './contracts/queue.interface';
import { CreateRepositoryPushRequest } from './entities/dto/CreateRepositoryPushRequest';
import { RepositoryPushCreateEvent } from './entities/dto/RepositoryPushCreateEvent';
import { ConfigService } from '@nestjs/config';

export const QUEUE_SERVICE_NAME = 'REPOSITORY_PUSH_EVENT_SERVICE';
const KAFKA_REPOSITORY_PUSH_QUEUE_VAR = 'KAFKA_REPOSITORY_PUSH_QUEUE';
@Injectable()
export class QueueService implements QueueInterface {
  private kafkaRepositoryPushQueue: string;

  constructor(
    @Inject(QUEUE_SERVICE_NAME)
    private readonly RepositoryClient: ClientKafka,
    configService: ConfigService,
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
  }: CreateRepositoryPushRequest) {
    await this.RepositoryClient.emit(
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
  }
}
