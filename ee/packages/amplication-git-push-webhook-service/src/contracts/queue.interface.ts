import { CreateRepositoryPushRequest } from 'src/entities/dto/CreateRepositoryPushRequest';

export interface QueueInterface {
  createPushRequest(createRepositoryPushRequest: CreateRepositoryPushRequest);
}
