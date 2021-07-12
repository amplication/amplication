import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaddleEvent } from './dto/PaddleEvent';
import { PaddlePassthroughData } from './dto/PaddlePassthroughData';
import { serialize } from 'php-serialize';
import { SubscriptionService } from './subscription.service';
import crypto from 'crypto';
import {
  SubscriptionData,
  EnumPaddleSubscriptionStatus
} from './dto/SubscriptionData';
import { PaddleCreateSubscriptionEvent } from './dto/PaddleCreateSubscriptionEvent';
import { EnumSubscriptionPlan, EnumSubscriptionStatus } from './dto';

const PADDLE_PUBLIC_KEY_VAR = 'PADDLE_PUBLIC_KEY';

const PADDLE_PLAN_ID_TO_SUBSCRIPTION_PLAN: {
  [key: string]: EnumSubscriptionPlan;
} = {
  ['658633']: EnumSubscriptionPlan.Pro, //prod
  ['658632']: EnumSubscriptionPlan.Business, //prod
  ['13780']: EnumSubscriptionPlan.Pro, //sandbox
  ['13781']: EnumSubscriptionPlan.Business //sandbox
};

@Injectable()
export class PaddleService {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly configService: ConfigService
  ) {}

  // Verify Paddle webhook data using our public key
  private async verifyPaddleWebhook(
    paddleEvent: PaddleEvent
  ): Promise<boolean> {
    const signature = paddleEvent.p_signature;
    const keys = Object.keys(paddleEvent)
      .filter(k => k !== 'p_signature')
      .sort();
    const sorted = {};

    keys.forEach(key => {
      sorted[key] = paddleEvent[key];
    });

    const serialized = serialize(sorted);
    try {
      const verifier = crypto.createVerify('sha1');
      verifier.write(serialized);
      verifier.end();

      return verifier.verify(
        this.configService.get(PADDLE_PUBLIC_KEY_VAR),
        signature,
        'base64'
      );
    } catch (err) {
      return false;
    }
  }

  private getWorkspaceIdFromEvent(paddleEvent: PaddleEvent): string {
    const { passthrough } = paddleEvent;

    const passthroughData: PaddlePassthroughData = JSON.parse(passthrough);

    if (!passthroughData.workspaceId) {
      throw new Error('Cannot find workspace ID on the event data');
    }

    return passthroughData.workspaceId;
  }

  async handlePaddleWebhook(paddleEvent: PaddleEvent): Promise<void> {
    if (!this.verifyPaddleWebhook(paddleEvent)) {
      throw new Error('Bad signature or public key'); // Webhook was not sent from Paddle
    }

    switch (paddleEvent.alert_name) {
      case 'subscription_created': {
        return this.createSubscription(
          paddleEvent as PaddleCreateSubscriptionEvent
        );
      }
      // case 'subscription_updated': {
      //   return this.updateSubscription(paddleEvent);
      // }
      // case 'subscription_cancelled': {
      //   return this.cancelSubscription(paddleEvent);
      // }
      default: {
        throw new Error('Unsupported Paddle event');
      }
    }
  }

  private async createSubscription(
    paddleEvent: PaddleCreateSubscriptionEvent
  ): Promise<void> {
    const workspaceId = this.getWorkspaceIdFromEvent(paddleEvent);
    const data: SubscriptionData = {
      paddleEmail: paddleEvent.email,
      paddleUserId: paddleEvent.user_id,
      paddleSubscriptionId: paddleEvent.subscription_id,
      paddleSubscriptionPlanId: paddleEvent.subscription_plan_id,
      paddleSubscriptionStatus: this.convertPaddleStatusStringToEnum(
        paddleEvent.status
      ),
      paddleNextBillDate: new Date(paddleEvent.next_bill_date),
      paddleCancellationEffectiveDate: null,
      paddlePausedFrom: null,
      paddleUpdateUrl: paddleEvent.update_url,
      paddleCancelUrl: paddleEvent.cancel_url
    };

    await this.subscriptionService.createSubscription({
      workspaceId,
      plan: this.convertPaddlePlanToSubscriptionPlan(
        data.paddleSubscriptionPlanId
      ),
      status: this.convertPaddleStatusToSubscriptionStatus(
        data.paddleSubscriptionStatus
      ),
      subscriptionData: data
    });
    return;
  }

  // async updateSubscription(paddleEvent: PaddleEvent): Promise<void> {
  //   const workspaceId = this.getWorkspaceIdFromEvent(paddleEvent);
  //   return this.subscriptionService.createSubscription(workspaceId);
  // }

  // async cancelSubscription(paddleEvent: PaddleEvent): Promise<void> {
  //   const workspaceId = this.getWorkspaceIdFromEvent(paddleEvent);
  //   return this.subscriptionService.createSubscription(workspaceId);
  // }

  private convertPaddleStatusStringToEnum(
    paddleStatus: string
  ): EnumPaddleSubscriptionStatus {
    switch (paddleStatus) {
      case 'active':
        return EnumPaddleSubscriptionStatus.Active;
      case 'trialing':
        return EnumPaddleSubscriptionStatus.Trailing;
      case 'past_due':
        return EnumPaddleSubscriptionStatus.PastDue;
      case 'paused':
        return EnumPaddleSubscriptionStatus.Paused;
      case 'deleted':
        return EnumPaddleSubscriptionStatus.Deleted;
      default:
        throw new Error('Invalid paddle status');
    }
  }

  private convertPaddlePlanToSubscriptionPlan(
    paddlePlanId: string
  ): EnumSubscriptionPlan {
    const plan = PADDLE_PLAN_ID_TO_SUBSCRIPTION_PLAN[paddlePlanId];
    if (!plan) throw new Error('Unknown Paddle plan id');
    return plan;
  }

  private convertPaddleStatusToSubscriptionStatus(
    paddleStatus: EnumPaddleSubscriptionStatus
  ): EnumSubscriptionStatus {
    switch (paddleStatus) {
      case EnumPaddleSubscriptionStatus.Active:
        return EnumSubscriptionStatus.Active;
      case EnumPaddleSubscriptionStatus.Deleted:
        return EnumSubscriptionStatus.Deleted;
      case EnumPaddleSubscriptionStatus.PastDue:
        return EnumSubscriptionStatus.PastDue;
      case EnumPaddleSubscriptionStatus.Paused:
        return EnumSubscriptionStatus.Paused;
      case EnumPaddleSubscriptionStatus.Trailing:
        return EnumSubscriptionStatus.Trailing;
    }
  }
}
