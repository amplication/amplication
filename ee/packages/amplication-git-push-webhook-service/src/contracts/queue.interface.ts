import { CreateRepositoryPushRequest } from '../entities/dto/CreateRepositoryPushRequest';

export interface QueueInterface {
  createPushRequest(createRepositoryPushRequest: CreateRepositoryPushRequest);
}
