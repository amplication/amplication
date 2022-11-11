/* eslint-disable @typescript-eslint/naming-convention*/

import { PaddleEvent } from './PaddleEvent';

export class PaddleCancelSubscriptionEvent extends PaddleEvent {
  status: string;

  cancellation_effective_date: string;

  [key: string]: unknown;
}
