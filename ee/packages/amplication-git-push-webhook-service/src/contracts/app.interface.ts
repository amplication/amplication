import { EmitterWebhookEventName } from '@octokit/webhooks';
import { EnumProvider } from '../entities/enums/provider';

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
