import { EmitterWebhookEventName } from '@octokit/webhooks';

export interface IApp {
  createPushMessage(
    id: string,
    eventName: EmitterWebhookEventName,
    payload: string,
    signature: string,
  );

  verifyAndReceive(
    id: string,
    eventName: EmitterWebhookEventName,
    payload: string,
    signature: string,
  ): Promise<boolean>;
}
