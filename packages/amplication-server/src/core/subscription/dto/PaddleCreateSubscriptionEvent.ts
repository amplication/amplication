/* eslint-disable @typescript-eslint/naming-convention*/

import { PaddleEvent } from './PaddleEvent';

export class PaddleCreateSubscriptionEvent extends PaddleEvent {
  status: string;

  next_bill_date: string;

  cancel_url: string;

  update_url: string;

  unit_price: string;

  [key: string]: unknown;
}
