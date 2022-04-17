import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { IQueue } from './contracts/IQueue';
import { CreateRepositoryPushRequest } from './entities/dto/CreateRepositoryPushRequest';
import { RepositoryPushCreateEvent } from './entities/dto/RepositoryPushCreateEvent';

export const QUEUE_SERVICE_NAME = 'REPOSITORY_PUSH_EVENT_SERVICE';

@Injectable()
export class QueueService implements IQueue {
  constructor(
    @Inject(QUEUE_SERVICE_NAME)
    private readonly RepositoryClient: ClientKafka,
  ) {}
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
      'repositoryPush_created',
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
