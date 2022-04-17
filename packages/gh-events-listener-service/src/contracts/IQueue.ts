import { CreateRepositoryPushRequest } from 'src/entities/dto/CreateRepositoryPushRequest';

export interface IQueue {
  createPushRequest(createRepositoryPushRequest: CreateRepositoryPushRequest);
}
