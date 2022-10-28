import { CreateRepositoryPush } from './dto/create-repository-push.dto';
import { EmitterWebhookEventName } from '@octokit/webhooks';
import { EnumProvider } from '../git-organization/git-organization.types';

export enum KafkaTopics {
  KafkaRepositoryPush = 'git.external.push.event.0',
}

export interface QueueInterface {
  createPushRequest(createRepositoryPushRequest: CreateRepositoryPush);
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
