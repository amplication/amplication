import { CreateRepositoryPushRequest } from './dto/create-repository-push-request';
import { EmitterWebhookEventName } from '@octokit/webhooks';
import { EnumProvider } from '../git-organization/git-organization.types';

export interface QueueInterface {
  createPushRequest(createRepositoryPushRequest: CreateRepositoryPushRequest);
}

export interface AppInterface {
  createMessage(
    id: string,
    eventName: EmitterWebhookEventName,
    payload: string,
    signature: string,
    provider: EnumProvider,
  );

  verifyAndReceive(
    id: string,
    eventName: EmitterWebhookEventName,
    payload: string,
    signature: string,
  ): Promise<boolean>;
}
